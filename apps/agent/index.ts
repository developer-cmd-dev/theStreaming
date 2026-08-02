import { publicUserSchema, type PublicUser, type SendBotMessage, type TelegramUpdate } from '@repo/zod/schema';
import express, { type Request, type Response } from 'express';
import { genAi } from './genAi'
import redisClient from '@repo/redis/redisClient';
import Bot from './telegramBot';
import { prisma } from '../../packages/db';
import { redis } from 'bun';

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
            const response = await genAi(message);
            if (response) {

                Bot.sendMessages({ chat_id: chatId, text: response.toString() })
                res.sendStatus(200)
                return
            }

        }
    } catch (error) {
        console.log(error);
        res.sendStatus(200);
        return
    }
});







app.listen(3003, (error) => {
    if (error) {
        console.log(error);
        return
    }
    console.log(`Agent server is running on ${3003}`);
})