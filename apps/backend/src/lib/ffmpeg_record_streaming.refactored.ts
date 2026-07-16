import type { Response } from "express";
import { existsSync, mkdirSync } from "fs";
import { join, resolve } from "path";

type SsePayload = {
  message: string;
  status: number;
  data?: unknown;
};

const MAX_TRIES = 10;
const RETRY_DELAY_MS = 500;

export async function recordStreaming(
  streamId: string,
  res: Response,
): Promise<string | null> {
  const recordingsDir = ensureRecordingsDir(streamId);
  const outputFileName = `${streamId}.mkv`;
  const outputPath = join(recordingsDir, outputFileName);

  for (let attempt = 1; attempt <= MAX_TRIES; attempt++) {
    const proc = Bun.spawn(buildFfmpegCommand(streamId, outputPath), {
      stdin: "ignore",
      stdout: "ignore",
      stderr: "pipe",
    });

    const stderrTask = monitorFfmpegProgress(proc.stderr, res);
    const exitCode = await proc.exited;
    await stderrTask;

    if (exitCode === 0) {
      sendSse(res, "RECORDING COMPLETED", 200, { streamId, fileName: outputFileName });
      console.log("Stream recorded successfully in .mkv format.");
      return outputFileName;
    }

    console.error(`FFmpeg recording failed on attempt ${attempt}/${MAX_TRIES}.`);

    if (attempt < MAX_TRIES) {
      await Bun.sleep(RETRY_DELAY_MS);
    }
  }

  sendSse(res, "RECORDING FAILED", 500, { streamId });
  return null;
}

function ensureRecordingsDir(streamId: string): string {
  const projectRoot = resolve(process.cwd(), "..");
  const recordingsRoot = join(projectRoot, "recordings");
  const recordingsDir = join(recordingsRoot, `${streamId}_video`);

  if (!existsSync(recordingsDir)) {
    mkdirSync(recordingsDir, { recursive: true });
  }

  return recordingsDir;
}

function buildFfmpegCommand(streamId: string, outputPath: string): string[] {
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

async function monitorFfmpegProgress(
  stderr: ReadableStream<Uint8Array> | null,
  res: Response,
): Promise<void> {
  if (!stderr) return;

  const reader = stderr.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  try {
    while (true) {
      const { done, value } = await reader.read();

      if (done) break;
      if (!value) continue;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split(/\r?\n/);
      buffer = lines.pop() ?? "";

      for (const line of lines) {
        const trimmed = line.trim();

        if (!trimmed) continue;

        if (trimmed.startsWith("frame=")) {
          console.log(trimmed,'from console');
          sendSse(res, "RECORDING STREAM", 200);
        }
      }
    }

    const trailing = buffer.trim();
    if (trailing.startsWith("frame=")) {
      console.log(trailing);
      sendSse(res, "RECORDING STREAM", 200);
    }
  } finally {
    reader.releaseLock();
  }
}

function sendSse(res: Response, message: string, status: number, data: unknown = null): void {
  if (res.writableEnded || res.destroyed) return;
  res.write(`data:${sseResponse(message, status, data)}\n\n`);
}

export function sseResponse(message: string, status: number, data: unknown = null): string {
  const payload: SsePayload = { message, status, data };
  return JSON.stringify(payload);
}
