import { axiosHandler, type AxiosPayload } from "@repo/axios";
import type { HttpResponse } from "@repo/zod/schema";
import type { Message } from "ollama"



interface UserContextData extends Pick<Message,'role'|'content'|'username'|'tool_name'> {

}


class ContextMemory {

    private contextMap = new Map<string, Message[]>()
    private HTTP_URL =process.env.HTTP_SERVER_URL ?? ""


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

        setTimeout(async () => {
            const currentContext = this.contextMap.get(key);
            if (currentContext && currentContext.length > 0) {
                try {
                    await this.saveCallback(key, currentContext);
                } catch (e) {
                    console.error(`Failed to persist context for ${key}:`, e);
                    return;
                }
                this.contextMap.delete(key);
            }
        }, 1000*60);
    }



    async saveCallback(key: string, data: UserContextData[]):Promise<any>{

        try {
            const payload:AxiosPayload={
                url:`${this.HTTP_URL}/save-agent-chat`,
                method:"POST",
                data:{username:key,contextData:data},
                headers:{
                    "Authorization":"",
                }
            }
          const response =await  axiosHandler<HttpResponse<UserContextData>>(payload);
          console.log(response)
        } catch (error) {
            throw error
        }

    }




}



export const contextMemory = new ContextMemory()