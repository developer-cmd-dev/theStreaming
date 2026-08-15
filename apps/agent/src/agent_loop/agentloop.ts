import type { Message } from "ollama";
import { ollamaAi } from "../llm_models/ollama";
import { Tools } from "../tools/tools";
import type { CreateStreamInput } from "@repo/zod/schema";
import { CustomError } from "@repo/customError";
import { log_data } from "../console/console";
import type { UserAuth } from "..";
import { contextMemory } from "../agent/contextMemory";






export async function agentLoop(content: string, userPayload: UserAuth): Promise<string> {

    const telegramUsername = userPayload.telegramUsername


    let memory = contextMemory.setMemory(telegramUsername, { role: "user", content })
    try {


        const maxIteration = 10;
        let iteration = 0;
        while (iteration <= maxIteration) {
            iteration++;
            const llmResponse = await ollamaAi(memory);
            const tools = llmResponse.message.tool_calls;
            if (tools) {
                for (const tool of tools) {
                    // TODO: Only declared/implemented tools should be handled here. If more tools are exposed in ollama.ts, add handlers for them or remove them from the schema.

                    switch (tool.function.name) {
                        case 'create_stream': (async () => {
                            try {
                                const args = tool.function.arguments;
                                const streamData: CreateStreamInput = <CreateStreamInput>args
                                const response = await Tools.createStream(streamData, userPayload.jwt_token);
                                const content: Message = { role: 'tool', tool_name: tool.function.name, content: response.streamId }
                                memory = contextMemory.setMemory(telegramUsername, content)
                            } catch (error) {
                                if (error instanceof CustomError) {
                                    const content = { role: "assistant", tool_name: tool.function.name, content: `Error came when http tool calling with status code-${error.statusCode} and message - ${error.message} ` }
                                    memory = contextMemory.setMemory(telegramUsername, content)
                                }
                            }
                        })()
                            break;
                        case 'schedule_streams': async () => {

                        }
                            break
                    }


                
                }
            } else {
                const llmMessage = llmResponse.message;
                memory = contextMemory.setMemory(telegramUsername, llmMessage)
                iteration=0;
                return llmResponse.message.content
            }

        }

        throw new CustomError("Iteration Limit Exceeded", 500)


    } catch (error) {
        throw error
    }


}


async function userContext(content: string, chatId: number) {

}


