import { axiosHandler } from "@repo/axios";
import {expect,test} from "bun:test";
import { Tools } from "../src/tools/tools";
import type { CreateStreamInput } from "@repo/zod/schema";


test("create stream",async()=>{
    const tools = new Tools();

    const streamData:CreateStreamInput ={
        title: "GTA 5 live stream RP",
        subscriberOnly: true,
        isLive: true,
        description: "Watch as we roleplay in GTA 5 with friends. Join live for epic heists, custom character stories, and interactive chat events!"
   
    }
    const response = await tools.createStream(streamData);

    expect(response).toBeObject()
})