import { roleSchema, type SendBotMessage } from "@repo/zod/schema";
import axios, { AxiosError } from "axios";
import { prisma } from "@repo/db/prisma";
import redisClient from "@repo/redis/redisClient";
import { CustomError } from "@repo/customError";


type ActionType = "typing" | "upload_photo" | "record_voice"
export default class Bot {

    static BOT_TOKEN = process.env.BOT_TOKEN ?? ""

    


    public static async logout(chatId: number, username: string): Promise<boolean> {


        await redisClient.del(username);
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
            if(error instanceof AxiosError){
                console.log(error.response?.data,'rom telegram bot')
            }
           throw new CustomError("Something went wrong",500)
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


    static async sendReplyMarkupMessage({message,chatId,input_field_placeholder}:{message:string,chatId:number,input_field_placeholder:string}){

        const botAuthMessage: SendBotMessage = {
            chat_id: chatId,
            text: message,
            reply_markup: {
                force_reply: true,
                input_field_placeholder: input_field_placeholder
            }

        }

         await this.sendMessages(botAuthMessage);

    }
}