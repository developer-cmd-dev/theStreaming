import type { SendBotMessage } from "@repo/zod/schema";
import axios from "axios";
import { join } from "../../packages/db/generated/prisma/internal/prismaNamespace";

export default class Bot {

    static BOT_TOKEN = process.env.BOT_TOKEN ?? ""

    public static async sendMessages(content: SendBotMessage):Promise<object>{

        if (!this.BOT_TOKEN || this.BOT_TOKEN.length == 0) {
            throw Error("Ivalid BOT token");
        }

        const sendMessageUrl = `https://api.telegram.org/bot${this.BOT_TOKEN}/sendMessage`;

        try {
            const response = await axios.post(sendMessageUrl, content);
           return response.data
        } catch (error) {
            console.log(error);
            throw Error("Something went wrong")
        }


    }


}