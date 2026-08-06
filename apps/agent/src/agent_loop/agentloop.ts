import type { Message } from "ollama";
import { ollamaAi } from "../llm_models/ollama";
import { Tools } from "../tools/tools";
import type { CreateStreamInput } from "@repo/zod/schema";
import { CustomError } from "@repo/customError";
import { log_data } from "../console/console";
import type { UserAuth } from "..";
import { contextMemory } from "../agent/contextMemory";





let contextMap = new Map<string,Message[]>();

export async function agentLoop(content: string,userPayload:UserAuth): Promise<string> {

    const telegramUsername = userPayload.telegramUsername
    // const checkUserContext = contextMap.has(telegramUsername);

    // if(!checkUserContext){
    //     contextMap.set(telegramUsername,[{role:"user",content}])
    // }else if(checkUserContext){
    //     const prevContext = contextMap.get(telegramUsername);
    //     prevContext?.push({role:"user",content});
    //     contextMap.set(telegramUsername,prevContext??[]);
    // }

    const memory = contextMemory.setMemory(telegramUsername,{role:"user",content})
    console.log(memory)
    try {

        while (true) {
          
            const llmResponse = await ollamaAi(memory);
            const tools = llmResponse.message.tool_calls;

            if (tools) {
                for (const tool of tools) {
                    if (tool.function.name === 'create stream') {
                        try {
                            const args = tool.function.arguments;
                            const streamData: CreateStreamInput = <CreateStreamInput>args
                            const response = await Tools.createStream(streamData,userPayload.jwt_token);
                            const content = { role: 'tool',tool_name:tool.function.name, content: response.streamId }
                                contextMemory.setMemory(telegramUsername,content)
                        } catch (error) {
                            if (error instanceof CustomError) {
                                const content = { role: "assistant",tool_name:tool.function.name ,content: `Error came when http tool calling with status code-${error.statusCode} and message - ${error.message} ` }
                                contextMemory.setMemory(telegramUsername,content)
                                
                            }
                        }
                    }
                    contextMap.set(telegramUsername,memory)
                }
            } else {
                const llmMessage = llmResponse.message;
                contextMemory.setMemory(telegramUsername,llmMessage)
                return llmResponse.message.content
            }

        }

    } catch (error) {
        throw error
    }


}


async function userContext(content:string,chatId:number) {
    
}


