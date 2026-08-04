import { publicUserSchema, type PublicUser, type SendBotMessage, type TelegramUpdate } from '@repo/zod/schema';
import express, { type Request, type Response } from 'express';
import { genAi } from './genAi'
import redisClient from '@repo/redis/redisClient';
import Bot from './telegramBot';
import { prisma } from '../../../packages/db';
import { runLoop } from './agentloop';


const app = express();


app.use(express.json());

app.get("/", (req: Request, res: Response) => {
    res.send("hello")
})

app.post('/webhook', async (req, res) => {
    const payload: TelegramUpdate = req.body;

    try {

        if (!payload) {
            res.sendStatus(200);
            return
        }

        const username = payload.message?.chat.username;
        const chatId = payload.message?.chat.id;
        const message = payload.message?.text



        if (!username || !chatId || !message) {
            res.sendStatus(200);
            return
        }


        if (payload.message?.text === '/logout') {
            const response = await Bot.login(chatId, username)
            if (response) {
                res.sendStatus(200)
                return;
            }
        }





        if (payload.message?.reply_to_message) {
            const email = payload.message.text;

            const { data: user } = publicUserSchema.safeParse(await prisma.user.findFirst({
                where: {
                    email
                }
            }))




            if (user) {
                const newBotUser = await prisma.aI_Agent_Bot.create({
                    data: {
                        telegramUsername: username,
                        userId: user?.id
                    }
                })

                await redisClient.sadd('users', username);
                await Bot.sendMessages({ chat_id: payload.message.chat.id, text: "You are authorized continue to chat." })
                res.sendStatus(200);
                return;
            } else {
                await Bot.sendMessages({ chat_id: payload.message.chat.id, text: "Invalid Email." })
                res.sendStatus(200);
                return;
            }


        }


        const checkUserInCache = await redisClient.sismember("users", username);


        if (!checkUserInCache) {

            const findInDB = await prisma.aI_Agent_Bot.findFirst({
                where: {
                    telegramUsername: username
                }
            })



            if (!findInDB) {
                const message = "Unauthorized User. You have to enter your Email."

                const botAuthMessage: SendBotMessage = {
                    chat_id: payload.message?.chat.id ?? 0,
                    text: message,
                    reply_markup: {
                        force_reply: true,
                        input_field_placeholder: "Enter Email"
                    }

                }

                const response = await Bot.sendMessages(botAuthMessage);
                res.sendStatus(200);
                return;
            } else {
                await redisClient.sadd('users', username);
                await Bot.sendMessages({ chat_id: chatId, text: "You are authorized continue to chat." })
                res.sendStatus(200);
                return;
            }

        } else {

            Bot.sendChatAction(chatId, "typing")
            const response = await runLoop(message);
            const formatedText = formateForTelegramBotMessage(response)
            Bot.sendMessages({chat_id:chatId,text:formatedText,parse_mode:"HTML"})
            res.sendStatus(200)

        }
    } catch (error) {
        console.log(error);
        res.sendStatus(200);
        return
    }
});


function formateForTelegramBotMessage(message:string):string{
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







app.listen(3003, (error) => {
    if (error) {
        console.log(error);
        return
    }

    console.log(`Agent server is running on ${3003}`);

    const worker = new Worker(new URL("./worker.ts", import.meta.url),{
        name:'Agent Cron job',
        type:'module'
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