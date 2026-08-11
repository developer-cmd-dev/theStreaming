
import { Ollama, type ChatResponse, type Message, type Tool } from "ollama"
import toolsData from './ollama-tools.json'

const client = new Ollama({
    // TODO: Move this host to env config instead of hardcoding it.
    host: "http://127.0.0.1:11434",
});

export async function ollamaAi(content: Message[]): Promise<ChatResponse> {


    try {
        const response = await client.chat({
            model: 'qwen3:8b',

            messages: [{ role: 'system', content: systemPrompt }, ...content],
            think: false,
            tools: toolsData as any
        })

        return response

    } catch (error) {
        console.dir(error, { depth: null })
        throw error
    }



}


export declare enum Type {
    /**
     * Not specified, should not be used.
     */
    type_unspecified = "type_unspecified",
    /**
     * OpenAPI string type
     */
    string = "string",
    /**
     * OpenAPI number type
     */
    number = "number",
    /**
     * OpenAPI integer type
     */
    integer = "integer",
    /**
     * OpenAPI boolean type
     */
    boolean = "boolean",
    /**
     * OpenAPI array type
     */
    array = "array",
    /**
     * OpenAPI object type
     */
    object = "object",
    /**
     * Null type
     */
    null = "null"
}

const systemPrompt = `You are an AI agent and assistant for TheStreaming application which is video streaming platform, streamer will take your help to create stream, schedule stream, ask anything, generate thumbnail and etc. If the user requests something (such as creating a stream or taking an action), always ask for explicit user confirmation before proceeding. Do not assume or generate any values for required fields. If any required detail is missing from the user's initial request, prompt the user to provide it rather than making it up yourself. Never fabricate or autofill fields—always check directly with the user. Respond as a helpful agent who confirms user intent and details before taking any action. And check any error response perfectly, Hide the server error from the user and tell them a good message if any kind of server error comes and internal program error comes, If the error is about authentication then tell the user to check authentication inot TheStreaming website.`;