import type { Message } from "ollama";
import { genAi } from "./genAi";
import { ollamaAi } from "./models/ollama";
import redisClient from "@repo/redis/redisClient";




let memory:Message[]=[]

export async function runLoop(content:string):Promise<string> {
    
    const getMemoryFromRedis = await redisClient.get('agent-memory');
    if(!getMemoryFromRedis) memory=[];
    else memory = JSON.parse(getMemoryFromRedis);
    console.log(getMemoryFromRedis)


    memory.push({role:"user",content});

    console.log(memory)

    try {
        
        const llmResponse = await ollamaAi(memory);
       console.dir(llmResponse.message,{depth:null,color:true})

       const llmMessage = llmResponse.message;
       memory.push(llmMessage)

      await redisClient.set("agent-memory",JSON.stringify(memory));
      

       return llmResponse.message.content




    } catch (error) {
        console.log(error);
        throw error
    }




}


