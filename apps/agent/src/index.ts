import { publicUserSchema, UsernameSearchQuerySchema, type HttpResponse, type PublicUser, type SendBotMessage, type TelegramUpdate } from '@repo/zod/schema';
import express, { response, type Request, type Response } from 'express';
import redisClient from '@repo/redis/redisClient';
import Bot from './bot/telegramBot';
import { prisma } from '../../../packages/db';
import { agentLoop } from './agent_loop/agentloop';
import { log_data } from './console/console';
import { axiosHandler, type AxiosPayload } from '@repo/axios';
import { CustomError } from '@repo/customError';
import { isNumericLiteral, isParenthesizedTypeNode } from 'typescript';
import { contextMemory } from './agent/contextMemory';


const app = express();


app.use(express.json());

app.get("/", (req: Request, res: Response) => {
    res.send("hello")
})

app.post('/webhook', async (req, res) => {
    const payload: TelegramUpdate = req.body;
    if (!payload) {
        res.sendStatus(200);
        return
    }

    

    const username = payload.message?.chat.username;
    const chatId = payload.message?.chat.id;
    const message = payload.message?.text

    if (!chatId || !message) {
        res.sendStatus(200);
        return
    }

    if (!username) {
        Bot.sendMessages({ chat_id: chatId, text: "Create username.." });
        res.sendStatus(200);
        return
    }


    try {
        if (payload.message?.text === '/logout') {
            const response = await Bot.logout(chatId, username);
            if (response) {
                res.sendStatus(200)
                return;
            }
        }

        if(payload.message?.text ==='/login'){
            const message = "Enter Connection Id"

            Bot.sendReplyMarkupMessage({ message, chatId, input_field_placeholder: "Enter Connection Id" })
            res.sendStatus(200)
            return;
        }


 
        if (payload.message?.reply_to_message?.text === "Enter Connection Id") {
            const connectionId = payload.message.text;


            if (!connectionId) {
                const message = "Enter Valid Connection Id"
                await Bot.sendReplyMarkupMessage({ message, chatId, input_field_placeholder: "Enter Connection Id" })
                return;
            }

            const formatedConnectionId = Number(connectionId.trim());

            if (typeof formatedConnectionId !== 'number' || !Number.isFinite(formatedConnectionId) || Math.abs(formatedConnectionId).toString().length !== 8) {
                const message = "Enter Valid Connection Id"
                await Bot.sendReplyMarkupMessage({ message, chatId, input_field_placeholder: "Enter Connection Id" })
                res.sendStatus(200);
                return;
            }

            const user = await userAuthentication(formatedConnectionId, username)
            if (user) {
               const response = await redisClient.hset(user.telegramUsername, "user", JSON.stringify(user));
       
               console.log(response)
                await Bot.sendMessages({ chat_id: payload.message.chat.id, text: "You are authorized continue to chat." })
                res.sendStatus(200);
                return;
            } else {
                await Bot.sendMessages({ chat_id: payload.message.chat.id, text: "Expired Connection ID." })
                res.sendStatus(200);
                return;
            }


        }


        const userInCache = await redisClient.hget(username,"user");
        

        // TODO: Simplify/fix this auth check. hget usually returns string | null, so a plain `if (!userInCache)` is clearer and less fragile.
        if (!userInCache && typeof userInCache === 'object') {
            const message = formateForTelegramBotMessage("Type /login to Authenticate.").trim()
            Bot.sendMessages({ text:message, chat_id:chatId,})
            res.sendStatus(200)
            return;
        } else {

            const userPayload: UserAuth = JSON.parse(userInCache);
            contextMemory.setActiveUser(userPayload);
            Bot.sendChatAction(chatId, "typing")
            // TODO: Protect against duplicate Telegram webhook deliveries so create actions (like stream creation) are not executed twice.
            // Explanation: Telegram may sometimes deliver the same webhook multiple times for a single user message,
            // especially in cases of network retries or delays. If this endpoint does not detect and ignore repeated messages,
            // state-changing actions (such as stream creation, or other idempotent operations) might get executed more than once,
            // leading to duplicated streams or unintended side effects. 
            // To resolve this, you should implement deduplication logic—track message IDs or a hash of incoming requests,
            // and ignore/process only the first delivery of each unique message.
            const response = await agentLoop(message, userPayload);
            const formatedText = formateForTelegramBotMessage(response).trim()
            Bot.sendMessages({ chat_id: chatId, text: formatedText, parse_mode: "HTML" })
            res.sendStatus(200)

        }
    } catch (error) {
        console.log(error);
        Bot.sendMessages({ chat_id: chatId, text: "Something went wrong" })
        res.sendStatus(200);
        return
    }
});


function formateForTelegramBotMessage(message: string): string {
    return message
        // Bold
        .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>")

        // Italic
        .replace(/\*(.*?)\*/g, "<i>$1</i>")

        // Inline code
        .replace(/`([^`]+)`/g, "<code>$1</code>")

        // Code blocks
        .replace(/```([\s\S]*?)```/g, "<pre>$1</pre>")

        // Headings
        .replace(/^### (.*)$/gm, "<b>$1</b>")
        .replace(/^## (.*)$/gm, "<b>$1</b>")
        .replace(/^# (.*)$/gm, "<b>$1</b>")

        // Bullets
        .replace(/^- /gm, "• ");
}


export interface UserAuth{
    telegramUsername:string,
    agentConnectionId: number,
    userId: string,
    jwt_token:string,
}

async function userAuthentication(connectionId: number, telegramUsername: string): Promise<UserAuth> {

    try {

        const payload: AxiosPayload = {
            url: "http://localhost:3000/api/v1/authenticate-agent",
            method: "POST",
            data: {
                connectionId,
                username:telegramUsername
            }
        }

        const response = await axiosHandler<HttpResponse<UserAuth>>(payload);
        return response.data

    } catch (error) {
        console.log(error)
        throw new CustomError("Something went wrong", 500)
    }



}







app.listen(3003, (error) => {
    if (error) {
        console.log(error);
        return
    }

    console.log(`Agent server is running on ${3003}`);

    const worker = new Worker(new URL("./worker.ts", import.meta.url), {
        name: 'Agent Cron job',
        type: 'module'
    });
    // console.log('Cron Job worker Deployed with id: ',worker.threadId)

    // worker.postMessage("start")
    // worker.onmessage=event=>{
    //     console.log(event.data)
    // }

    // worker.onerror = error=>{
    //     console.log(error)
    // }

    // const targetTime = new Date();
    // targetTime.setMinutes(targetTime.getMinutes()+1,0,0);

    // setInterval(() => {
    //     const currentTime = new Date();
    //     console.log(currentTime.getTime()," : ",targetTime.getTime())

    // }, 1000);

})