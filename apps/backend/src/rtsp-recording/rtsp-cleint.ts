export async function startRecordingWithRetry(
  streamId: string,
  maxRetries = 10
) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {


    const recordLiveStreamingFfmpegCMD = [
      "ffmpeg",
      "-rtsp_transport",
      "tcp",
      "-i",
      `rtsp://localhost:8554/live/${streamId}`,
      "-c",
      "copy",
      "-y",
      `/home/devslinux/Documents/Workdir/FullStackProjects/theStreaming/apps/recordings/${streamId}.mkv`,
    ]
    const proc = Bun.spawn(
     recordLiveStreamingFfmpegCMD,
      {
        stdout: "inherit",
        stderr: "inherit",
      }
    );

    const exitCode = await proc.exited;

    if (exitCode === 0) { 
 
    }

    console.log(
      `Recording attempt ${attempt} failed`
    );

    await Bun.sleep(1000);
  }

  throw new Error(
    `Unable to record stream ${streamId}`
  );
}





const proc = Bun.spawn(
  [
    "ffmpeg",

    "-i",
    `/home/devslinux/Documents/Workdir/FullStackProjects/theStreaming/apps/recordings/.mkv`,

    "-c:v",
    "libx264",

    "-c:a",
    "aac",

    "-b:a",
    "128k",

    "-g",
    "60",

    "-hls_time",
    "6",

    "-hls_playlist_type",
    "vod",

    "-hls_segment_filename",
    `/home/devslinux/Documents/Workdir/FullStackProjects/theStreaming/apps/recordings//stream_%03d.ts`,

    `/home/devslinux/Documents/Workdir/FullStackProjects/theStreaming/apps/recordings//output.m3u8`,
  ],
  {
    stdout: "inherit",
    stderr: "inherit",
  }
);

const exitCode = await proc.exited;

if (exitCode === 0) {
  console.log("HLS conversion completed successfully");
} else {
  console.error(`HLS conversion failed: ${exitCode}`);
}