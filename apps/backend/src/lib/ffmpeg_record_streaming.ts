import { mkdirSync, existsSync } from "fs";
export async function recordStreaming(streamId:string):Promise<string> {
    const maxTries=10;

    const recordingsDir = `/home/devslinux/Documents/Workdir/FullStackProjects/theStreaming/apps/recordings/${streamId}_video`;

    // Ensure the directory exists
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

    for(let tries=1;tries<=maxTries;tries++){

     const proc= Bun.spawn(recordLiveStreamingFFmpegCmd,{stderr:"inherit",stdout:"inherit"});

     if(await proc.exited===0){
        console.log('Stream has been recorded with original resoultion in .mkv file formate');
        return `${streamId}.mkv`
     }else{
        console.log('Something went wrong when recording the stream.')
       await Bun.sleep(500)
     }


    }

    throw new Error(`Failed to record stream ${streamId}` )


}