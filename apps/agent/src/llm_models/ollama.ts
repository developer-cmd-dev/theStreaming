
import {Ollama, type ChatResponse, type Message} from "ollama"


const client = new Ollama({
    host: "http://127.0.0.1:11434",
  });

export async function ollamaAi(content:Message[]):Promise<ChatResponse> {


  try {
        const response = await client.chat({
            model: 'qwen3:8b',
            messages: [{role:'system',content:systemPrompt},...content],
            think:false,
            tools:[
                {
                    type:'function',
                    function:{
                        name:"create stream",
                        description:"create a stream using http server of TheStreaming streaming application for the streamer",
                        parameters: {
                            type: "object",
                            properties: {
                                title: {
                                    type:"string",
                                },
                                description: {
                                    type: "string",
                                },
                                thumbnail: {
                                    type: "string",
                                },
                                subscriberOnly: {
                                    type: "boolean",
                                },
                                isLive: {
                                    type: "boolean",
                                },
                            },
                            required: ['title', "description"]
                        }
                    }
                },
                {
                    type:'function',
                    function:{
                        name:"schedule streams",
                        description:"Schedule the stream in cron job into theStreaming http server",
                        parameters: {
                            type: "object",
                            properties: {
                                streamId: {
                                    type:"string",
                                },
                                targetTime: {
                                    type: "string",
                                },
                               
                            },
                            required: ['streamId', "targetTime"]
                        }
                    }
                }
            ]
        })

        return response

    } catch (error) {
        console.dir(error,{depth:null}) 
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

const systemPrompt = `You are an AI agent and assistant for TheStreaming application which is video streaming platform, streamer will take your help to create stream, schedule stream, ask anything, generate thumbnail and etc. If the user requests something (such as creating a stream or taking an action), always ask for explicit user confirmation before proceeding. Do not assume or generate any values for required fields. If any required detail is missing from the user's initial request, prompt the user to provide it rather than making it up yourself. Never fabricate or autofill fields—always check directly with the user. Respond as a helpful agent who confirms user intent and details before taking any action.`;