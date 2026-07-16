import type { Response } from "express";
import { mkdirSync, existsSync } from "fs";
export async function recordStreaming(streamId: string, res: Response): Promise<string|null> {
    const maxTries = 10;

    let currentDirectory = process.cwd().replace("/backend", "/recordings");
    const recordingsDir = `${currentDirectory}/${streamId}_video`;

    if (!existsSync(recordingsDir)) {
        mkdirSync(recordingsDir, { recursive: true });
    }

    const recordLiveStreamingFFmpegCmd = [
        "ffmpeg",
        "-rtsp_transport",
        "tcp",
        "-i",
        `rtsp://localhost:8554/live/${streamId}`,
        "-c",
        "copy",
        "-y",
        `${recordingsDir}/${streamId}.mkv`,
    ];

    for (let tries = 1; tries <= maxTries; tries++) {

        const proc = Bun.spawn(recordLiveStreamingFFmpegCmd, {
            stdin: "pipe",
            stdout: "ignore",
            stderr: "pipe",
        });

        const decoder = new TextDecoder("utf-8");
        (async () => {
            if (!proc.stderr) return;

            const reader = proc.stderr.getReader();


            while (true) {
                const { done, value } = await reader.read();
                
                if(!value) break;

                if (done && value) {
                    res.write(`data:${sseResponse("RECORDING COMPLETED",200)}\n\n`)
                    break
                };

             
                const decodedValue = decoder.decode(value, { stream: true });

                if (decodedValue.startsWith("frame")) {
                    console.log(decodedValue);

                    res.write(`data:${sseResponse("RECORDING STREAM",200)}\n\n`)
                }
             

            }
        })();

        if (await proc.exited === 0) {
            console.log('Stream has been recorded with original resoultion in .mkv file formate');
            return `${streamId}.mkv`
        } else {
            console.log('Something went wrong when recording the stream.');
            await Bun.sleep(500)
        }


    }

  return null;


}


export function sseResponse(message:string,status:number,data:any=null):string{
    return JSON.stringify({message,status,data})
}