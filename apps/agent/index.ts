import type { SendBotMessage, TelegramUpdate } from '@repo/zod/schema';
import axios from 'axios';
import express, { type Request, type Response } from 'express';
import { genAi } from './genAi'
import redisClient from '@repo/redis/redisClient';
import Bot from './telegramBot';
import { prisma } from '../../packages/db';
import { CancelTuningJobResponse } from '@google/genai';

const app = express();


app.use(express.json());

app.get("/", (req: Request, res: Response) => {
    res.send("hello")
})

app.post('/webhook', async (req, res) => {

    const payload: TelegramUpdate = req.body;

    if (!payload) {
        res.sendStatus(500);
        return
    }

    console.log(payload)

    if (payload.message?.reply_to_message ) {
        console.log(payload.message.reply_to_message.from)
        const otp = Number(payload.message.text);
        await Bot.sendMessages({ chat_id: payload.message.chat.id, text: "You are authorized" })
        res.sendStatus(200);
        return;

    }

    const keyLike = String(payload.message?.from.id);

    const checkUserInCache = await redisClient.hget('users', keyLike);

    if (!checkUserInCache) {

        const findInDB = await prisma.aI_Agent_Bot.findFirst({
            where: {
                telegramUsername: payload.message?.chat.username
            }
        })



        if (!findInDB) {
            const message = "Unauthorized User. You have to enter the code that are given in browser page. Eg: 1234"

            const botAuthMessage: SendBotMessage = {
                chat_id: payload.message?.chat.id ?? 0,
                text: message,
                reply_markup: {
                    force_reply: true,
                    input_field_placeholder: "Enter the code"
                }

            }

            const response = await Bot.sendMessages(botAuthMessage);
            console.log(response);
            res.sendStatus(200);
            return;
        }

    }



    // const content:SendBotMessage = {
    // //     chat_id:payload.message?.chat.id ?? 0,
    // //     text:"Enter otp",
    // //     reply_markup:{
    // //         force_reply:true,
    // //         input_field_placeholder:"Enter OTP"
    // //     }
    // // }

    // // const response = await Bot.sendMessages(content)
    // // console.log(response)
});







app.listen(3003, (error) => {
    if (error) {
        console.log(error);
        return
    }
    console.log(`Agent server is running on ${3003}`);
})