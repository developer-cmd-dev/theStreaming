import { GoogleGenAI } from "@google/genai";

const GOOGLE_GEN_AI_API_KEY=process.env.GEMINI_API_KEY;

const ai = new GoogleGenAI({
    apiKey:GOOGLE_GEN_AI_API_KEY
});

export async function genAi(content?:string):Promise<string|boolean> {
   if(!content) return false

   const interaction = await ai.models.generateContent({
    model: "gemini-3.6-flash",
    config:{
        systemInstruction: "You are an AI assistant working solely as a chatbot. Your task is to provide appropriate and helpful replies to any text message you receive. Always respond as a text-based conversational agent."
    
    },
    contents:content
  });
      return interaction.text??false;
}