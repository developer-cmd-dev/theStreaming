import type { Message } from "ollama";
import { ollamaAi } from "./models/ollama";
import { Tools } from "./tools/tools";
import type { CreateStreamInput } from "@repo/zod/schema";
import { CustomError } from "@repo/customError";




let memory: Message[] = []

export async function runLoop(content: string): Promise<string> {
    const agentTools = new Tools()
    memory.push({ role: "user", content });
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
                            const response = await agentTools.createStream(streamData);
                            memory.push({ role: 'tool',tool_name:tool.function.name, content: response.streamId })
                        } catch (error) {
                            if (error instanceof CustomError) {
                                memory.push({ role: "assistant",tool_name:tool.function.name ,content: `Error came when http tool calling with status code-${error.statusCode} and message - ${error.message} ` })
                            }
                        }
                    }
                }
            } else {
                const llmMessage = llmResponse.message;
                memory.push(llmMessage)
                return llmResponse.message.content
            }
        }

    } catch (error) {
        throw error
    }


}


