import { axiosHandler, type AxiosPayload } from "@repo/axios";
import type { HttpResponse } from "@repo/zod/schema";
import type { Message } from "ollama"
import type { UserAuth } from "..";
import { AxiosError } from "axios";



interface UserContextData extends Pick<Message, 'role' | 'content' | 'username' | 'tool_name'> {

}


class ContextMemory {

    private contextMap = new Map<string, Message[]>()
    private HTTP_URL = process.env.HTTP_SERVER_URL ?? ""
    private activeUser = new Map<string, UserAuth>()
    private timer = new Map<string, NodeJS.Timeout>();

    setActiveUser(data: UserAuth) {
        this.activeUser.set(data.telegramUsername, data)
    }

    setMemory(key: string, content: Message): Message[] {
        let userContext = this.contextMap.get(key);
        if (!userContext) {
            userContext = this.contextMap.set(key, [content]).get(key);
        } else if (userContext) {
            userContext.push(content);
            this.contextMap.set(key, userContext);
        }
        this.schedulePersistAndClearMemory(key);
        return userContext ?? [];
    }


    deleteMemory(key: string): boolean {
        return this.contextMap.delete(key);
    }


    schedulePersistAndClearMemory(key: string): void {
        const userContext = this.contextMap.get(key);
        if (!userContext || userContext.length === 0) return;


        for(let [timerMapKey,value] of this.timer.entries()){
            if(timerMapKey === key){
                clearTimeout(value);
            }
        }
        

      
          const timerFunc = setTimeout(async () => {
                const currentContext = this.contextMap.get(key);
                if (currentContext && currentContext.length > 0) {
                    try {
                        const response = await this.saveCallback(key, currentContext);
                    } catch (e) {
                        console.error(`Failed to persist context for ${key}:`, e);
                        return;
                    }
                    // TODO: Be careful clearing memory immediately after save; if new messages arrive around this time, you can lose fresh context. Consider checking for newer messages/versioning before delete.
                    this.contextMap.delete(key);
                    this.activeUser.delete(key);
                    this.timer.delete(key);
                }
            }, 60000 * 3);

            this.timer.set(key,timerFunc)


    }



    async saveCallback(key: string, data: UserContextData[]): Promise<UserContextData> {
        const activeUserPayload = this.activeUser.get(key);

        try {
            const payload: AxiosPayload = {
                url: `${this.HTTP_URL}/save-agent-chat`,
                method: "POST",
                data: { username: key, contextData: data },
                headers: {
                    "Authorization": activeUserPayload?.jwt_token ? `Bearer ${activeUserPayload.jwt_token}` : ""
                }
            }
            return (await axiosHandler<HttpResponse<UserContextData>>(payload)).data;

        } catch (error) {
            if (error instanceof AxiosError) {
                console.log(error.response?.data)
            }
            throw error
        }

    }




}



export const contextMemory = new ContextMemory()