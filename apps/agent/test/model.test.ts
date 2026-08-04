import {test,expect} from "bun:test"
import { genAi } from "../src/genAi"
import { ollamaAi } from "../src/models/ollama";




test("model-test-gen-ai",async()=>{
   const response = await genAi("Hey Buddy create a stream and schedule it at 8pm today");

   expect(response).toBeFalse()
   
})

test("model-test-ollama",async()=>{
    const response = await ollamaAi;
 
    expect(response).toBeFalse()
    
 },100000)