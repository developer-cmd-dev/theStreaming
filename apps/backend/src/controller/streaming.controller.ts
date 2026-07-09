import { createStreamSchema } from "@repo/zod/schema";
import type { Request, Response } from "express";
import { CustomError } from "../error/customError";
import { prisma } from "@repo/db/prisma";
import HttpResponse from "../utils/HttpResponse";
import axios, { AxiosError } from 'axios';
import { connectMediaServerSchema } from "../../../../packages/zod/schema/stream";
import { startRecordingWithRetry } from '../rtsp-recording/rtsp-cleint'
import { recordStreaming } from "../lib/ffmpeg_record_streaming";
import { convertRecordedInToHLS } from "../lib/ffmpeg_convert_recording_hls";
import { uploadFolder } from "../lib/upload_hls_b2";

export async function createStream(req: Request, res: Response) {

    try {
        const { data: streamConfig, error } = createStreamSchema.safeParse(req.body);


        if (error) {
            const errorMessage = JSON.parse(error.message)[0].message
            throw new CustomError(errorMessage, 422);
        }

        console.log(streamConfig)

        const response = await prisma.stream.create({
            data: {
                title: streamConfig.title,
                description: streamConfig.description,
                thumbnail: streamConfig.thumbnail,
                isLive: streamConfig.isLive,
                subscriberOnly: streamConfig.subscriberOnly,
                userId: req.userId
            }
        })

        HttpResponse.success(res, { streamId: response.id });
    } catch (error) {
        console.log(error)
        throw new CustomError("Failed to create stream", 500)
    }

}


export async function connectMediaServer(req: Request, res: Response) {
    const { data, error } = connectMediaServerSchema.safeParse(req.body);

    if (error) {
        const errorMessage = JSON.parse(error.message)[0].message
        throw new CustomError(errorMessage, 422);
    }

    try {
        const stream = await prisma.stream.findUnique({
            where: { id: data.streamId },
            select: { id: true, userId: true }
        });
        if (!stream) {
            throw new CustomError("Stream not found.", 404);
        }
        if (req.userId && stream.userId !== req.userId) {
            throw new CustomError("Unauthorized access to this stream.", 403);
        }

        const whipEndpoint = `http://localhost:8889/live/${data.streamId}/whip`;
        const whipResponse = await axios.post(
            whipEndpoint,
            data.sdp,
            { headers: { "Content-Type": "application/sdp" } }
        );



        HttpResponse.success(res, { sdpAnswer: whipResponse.data });
    } catch (error) {
        if (error instanceof AxiosError) {
            const status = error.response?.status || 500;
            const message = error.response?.data || 'Error communicating with media server';
            throw new CustomError(message, status)
        } else {
            throw new CustomError("An unexpected error occurred while connecting to the media server.", 500);

        }

    }
}

export async function startRecordingStream(req: Request, res: Response) {
    try {
        const streamId = req.params.streamId


        if (!streamId) {
            throw new CustomError("Invalid Id", 404);
        }

        if (Array.isArray(streamId)) {
            throw new CustomError("Data is in array", 404)
        }

        const recordedFileName = await recordStreaming(streamId);
        if (recordedFileName) {
            const localDir = await convertRecordedInToHLS(recordedFileName, streamId);
            const result = await uploadFolder(localDir, streamId);
            if(result){
              await prisma.stream.update({
                where:{
                    id:streamId
                },
                data:{
                    playBackKey:result,
                    isLive:false
                }
                
               })
            }
        }
        HttpResponse.success(res, {}, 'Stream Recoreded Successfully', 200)
    } catch (error) {
        if (error instanceof Error) {
            throw new CustomError(error.message, 400)
        }
    }

}





export async function endStream(req: Request, res: Response) {

}