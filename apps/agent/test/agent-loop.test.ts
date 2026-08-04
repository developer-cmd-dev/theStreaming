import {test,expect} from 'bun:test'
import { runLoop } from '../src/agentloop'
import redisClient from '@repo/redis/redisClient'



test("agent-loop",async ()=>{
   const response = await runLoop("yes this is okay")

   expect(response).toBeString()


},1000000)