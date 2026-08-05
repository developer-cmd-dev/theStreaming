import type { Message } from "ollama";
import { ollamaAi } from "../llm_models/ollama";
import { Tools } from "../tools/tools";
import type { CreateStreamInput } from "@repo/zod/schema";
import { CustomError } from "@repo/customError";
import { log_data } from "../console/console";





let contextMap = new Map<number,Message[]>();

export async function runLoop(content: string,chatId:number): Promise<string> {

    const checkUserContext = contextMap.has(chatId);

    if(!checkUserContext){
        contextMap.set(chatId,[{role:"user",content}])
    }else if(checkUserContext){
        const prevContext = contextMap.get(chatId);
        prevContext?.push({role:"user",content});
        contextMap.set(chatId,prevContext??[]);
    }

    const memory = contextMap.get(chatId);
    if(!memory) return ""; // it needs to be fix

    try {

        while (true) {
          
            const llmResponse = await ollamaAi(memory);
            console.dir(llmResponse.message, { depth: null, color: true })

            const tools = llmResponse.message.tool_calls;

            if (tools) {
                for (const tool of tools) {
                    if (tool.function.name === 'create stream') {
                        try {
                            const args = tool.function.arguments;
                            const streamData: CreateStreamInput = <CreateStreamInput>args
                            const response = await Tools.createStream(streamData);
                            memory.push({ role: 'tool',tool_name:tool.function.name, content: response.streamId })
                        } catch (error) {
                            if (error instanceof CustomError) {
                                memory.push({ role: "assistant",tool_name:tool.function.name ,content: `Error came when http tool calling with status code-${error.statusCode} and message - ${error.message} ` })
                            }
                        }
                    }
                    contextMap.set(chatId,memory)
                }
            } else {
                const llmMessage = llmResponse.message;
                memory.push(llmMessage)
                contextMap.set(chatId,memory)
                log_data(contextMap)

                return llmResponse.message.content
            }

        }

    } catch (error) {
        throw error
    }


}


async function userContext(content:string,chatId:number) {
    
}


