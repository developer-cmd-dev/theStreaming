import fs from 'fs'
import path from 'path';

export async function convertRecordedInToHLS(recordedFileName: string, streamId: string): Promise<string> {

    if (!recordedFileName && !streamId) throw new Error("Missing File name");

    const maxTries = 10;

    for (let tries = 0; tries <= maxTries; tries++) {


        const recordedFileDirectory = `/home/devslinux/Documents/Workdir/FullStackProjects/theStreaming/apps/recordings/${streamId}_video`

        if (!fs.existsSync(recordedFileDirectory)) throw new Error("Folder not found");

        const recoredFilePath = path.join(recordedFileDirectory, recordedFileName)

        console.log(`Starting HLS conversion for file: ${recoredFilePath}`);

        const hlsStoreDir = path.join(recordedFileDirectory, "hls_video");

        if (!fs.existsSync(hlsStoreDir)) {
            fs.mkdirSync(hlsStoreDir, { recursive: true })
        }

        const convertRecordedInToHLSCMD = [
            "ffmpeg",
            "-i",
            recoredFilePath,
            "-c",
            "copy",                          // stream copy, no re-encoding (fast)
            "-start_number",
            "0",                             // segment numbering starts at 0
            "-hls_time",
            "3",                            // ~10 sec per segment
            "-hls_list_size",
            "0",                             // keep all segments in the playlist (VOD)
            "-hls_playlist_type",
            "vod",                           // mark as VOD, not live
            "-hls_segment_filename",
            path.join(hlsStoreDir, "segment_%03d.ts"),  // segment file naming/location
            "-f",
            "hls",
            path.join(hlsStoreDir, "output.m3u8")       // final playlist location
        ];

        const proc = Bun.spawn(convertRecordedInToHLSCMD, { stderr: "inherit", stdout: 'inherit' })


        if (await proc.exited === 0) {
            console.log("Stream converted Successfully")
            return hlsStoreDir;
        } else {
            console.log("Something went wrong while conversion.")
            await Bun.sleep(500);
        }

    }
    throw new Error("something went wrong")

}