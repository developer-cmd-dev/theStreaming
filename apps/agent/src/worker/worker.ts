import { CancelTuningJobResponse } from "@google/genai";
import redisClient from "@repo/redis/redisClient";

// prevents TS errors
declare var self: Worker;

self.onmessage = (event: MessageEvent) => {
  if(event.data === 'start'){
    let targetTime = new Date()
    console.log(targetTime);
    console.log(targetTime.toString());
    console.log(targetTime.toISOString());
    console.log(targetTime.toUTCString());
    console.log(targetTime.toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
    }));
    
  }
};