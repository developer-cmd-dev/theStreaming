import type { Response } from "express";
import { mkdirSync, existsSync } from "fs";
import path, { resolve } from "path";
import { CustomError } from "../error/customError";


const MAX_TRIES = 10;
const RETRY_DELAY_MS = 500;


export async function recordStreaming(streamId: string, res: Response): Promise<string | null> {

    const recordingsDir = ensureRecordingsDir(streamId)

    const ffmpegCommand = buildFfmpegCommand(streamId, recordingsDir)


    for (let tries = 1; tries <= MAX_TRIES; tries++) {

        const proc = Bun.spawn(ffmpegCommand, {
            stdin: "pipe",
            stdout: "ignore",
            stderr: "inherit",
        });

  
        if (await proc.exited === 0) {
            console.log('Stream has been recorded with original resoultion in .mkv file formate');
            return `${streamId}.mkv`
        } else {
            console.log('Something went wrong when recording the stream.');
            await Bun.sleep(RETRY_DELAY_MS)
        }


    }

    throw new CustomError("Something went wrong to recording stream", 400);


}

function buildFfmpegCommand(streamId: string, recordingDir: string): string[] {

    const outputPath = path.join(recordingDir, `${streamId}.mkv`)
    return [
        "ffmpeg",
        "-rtsp_transport",
        "tcp",
        "-i",
        `rtsp://localhost:8554/live/${streamId}`,
        "-c",
        "copy",
        "-y",
        outputPath,
    ];
}


export function ensureRecordingsDir(streamId: string) {

    const projectRoot = resolve(process.cwd(), "..");
    const recordingRoots = path.join(projectRoot, "recordings");
    const recordingDirs = path.join(recordingRoots, `${streamId}_video`)

    if (!existsSync(recordingDirs)) {
        mkdirSync(recordingDirs, { recursive: true })
    }
    return recordingDirs;

}
