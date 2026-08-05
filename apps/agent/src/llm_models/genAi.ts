import { DocumentState, GoogleGenAI, Type } from "@google/genai";
import { Tools } from "./tools";

const GOOGLE_GEN_AI_API_KEY = process.env.GEMINI_API_KEY;

const ai = new GoogleGenAI({
    apiKey: GOOGLE_GEN_AI_API_KEY
});

export async function genAi(content?: string, toolsData?: string): Promise<string | boolean> {
  try {
    if (!content) return false

    const tools = new Tools();

    const interaction = await ai.models.generateContent({
        model: "gemini-3.5-flash-lite",
        config: {
            systemInstruction: systemPrompt,
            tools: [
                {
                    functionDeclarations: [
                        {
                            name: "create_stream",
                            description: "It will create the stream using send the api request to the api server",
                            parameters: {
                                type: Type.OBJECT,
                                properties: {
                                    title: {
                                        type: Type.STRING,
                                    },
                                    description: {
                                        type: Type.STRING,
                                    },
                                    thumbnail: {
                                        type: Type.STRING,
                                    },
                                    subscriberOnly: {
                                        type: Type.BOOLEAN,
                                    },
                                    isLive: {
                                        type: Type.BOOLEAN,
                                    },
                                },
                                required: ['title', "description","thumbnail"]
                            }
                        }
                    ]
                }
            ]
        },
        contents: content,
    });
    

    for (const parts of interaction.candidates?? []){

        console.log(parts.content)
    }

    return  false;
  } catch (error) {
    console.log(error);
    throw error   
  }
}

const systemPrompt = `You are an AI agent and assistant for TheStreaming application which is video streaming platform, streamer will take your help to create stream, schedule stream, ask anything, generate thumbnail and etc. If the user requests something (such as creating a stream or taking an action), always ask for explicit user confirmation before proceeding. Do not assume or generate any values for required fields. If any required detail is missing from the user's initial request, prompt the user to provide it rather than making it up yourself. Never fabricate or autofill fields—always check directly with the user. Respond as a helpful agent who confirms user intent and details before taking any action.`;