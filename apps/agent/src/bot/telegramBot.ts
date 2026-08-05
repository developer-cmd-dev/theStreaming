import { roleSchema, type SendBotMessage } from "@repo/zod/schema";
import axios from "axios";
import { prisma } from "../../../packages/db";
import redisClient from "@repo/redis/redisClient";


type ActionType = "typing" | "upload_photo" | "record_voice"
export default class Bot {

    static BOT_TOKEN = process.env.BOT_TOKEN ?? ""




    public static async login(chatId: number, username: string): Promise<boolean> {
        await prisma.aI_Agent_Bot.delete({
            where: {
                telegramUsername: username
            }
        });

        await redisClient.srem("users", username);
        const response: { ok: boolean } = <{ ok: boolean }>await this.sendMessages({ chat_id: chatId, text: "Logout successfully" });

        if (!response.ok) return false;
        return true;
    }

    public static async sendMessages(content: SendBotMessage): Promise<object> {

        if (!this.BOT_TOKEN || this.BOT_TOKEN.length == 0) {
            throw Error("Ivalid BOT token");
        }

        const url = `https://api.telegram.org/bot${this.BOT_TOKEN}/sendMessage`;

        try {
            const response = await axios.post(url, content);
            return response.data
        } catch (error) {
            console.log(error);
            throw Error("Something went wrong")
        }


    }

    public static async sendChatAction(chatId: number, actionType: ActionType) {

        if (!this.BOT_TOKEN || this.BOT_TOKEN.length == 0) {
            throw Error("Ivalid BOT token");
        }

        const url = `https://api.telegram.org/bot${this.BOT_TOKEN}/sendChatAction`;

        try {
            const response = await axios.post(url, { chat_id: chatId, action: actionType });
        } catch (error) {
            console.log(error);
            throw Error("Something went wrong")
        }
    }

}