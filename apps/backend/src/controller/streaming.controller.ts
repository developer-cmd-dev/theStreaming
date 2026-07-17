import { createStreamSchema } from "@repo/zod/schema";
import type { Request, Response } from "express";
import { CustomError } from "../error/customError";
import { prisma } from "@repo/db/prisma";
import HttpResponse from "../utils/HttpResponse";
import axios, { AxiosError } from 'axios';
import { connectMediaServerSchema } from "../../../../packages/zod/schema/stream";
import { recordStreaming, sseResponse } from "../lib/ffmpeg_record_streaming.refactored";
import { convertRecordedInToHLS } from "../lib/ffmpeg_convert_recording_hls";
import { uploadFolder } from "../lib/upload_hls_b2";

import { deleteStreamDataB2 } from "../lib/delete_hls_b2";
import { axiosHandler } from "../lib/axios";

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

    const stream = await prisma.stream.findUnique({
        where: { id: data.streamId },
        select: { id: true, userId: true }
    });

    if (!stream) {
        throw new CustomError("Stream not found.", 404);
    }

    try {

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
            console.log(error)
            throw new CustomError("An unexpected error occurred while connecting to the media server.", 500);

        }

    }
}

export async function startRecordingStream(req: Request, res: Response) {

        const streamId = req.params.streamId


        if (!streamId) {
            throw new CustomError("Invalid Id", 404);
        }

        if (Array.isArray(streamId)) {
            throw new CustomError("Data is in array", 404)
        }

        const recordedFileName = await recordStreaming(streamId, res);
        if(!recordedFileName){
            res.write(`data:${sseResponse("ERROR:FAILED TO RECORD STREAM",400)}\n\n`);
            res.end();
            return;
        }

        if (recordedFileName) {
            const localDir = await convertRecordedInToHLS(recordedFileName, streamId);
            const result = await uploadFolder(localDir, streamId, res);
            if (result) {
                await prisma.stream.update({
                    where: {
                        id: streamId
                    },
                    data: {
                        playBackKey: result,
                        isLive: false
                    }

                })
            }
        }
        HttpResponse.success(res,null)
}

export async function endStream(req: Request, res: Response) {

    try {

        const streamId = req.params.streamId?.toString();
        if (!streamId) {
            throw new CustomError("Invalid Stream id", 400);
        }

        await prisma.stream.update({
            where: {
                id: streamId
            },
            data: {
                isLive: false
            }
        })



        HttpResponse.success(res);
    } catch (error) {
        if (error instanceof AxiosError) {
            console.log(error.message, error.response)
        }
        throw new CustomError("Something went wrong", 500);
    }



}

export async function deleteStream(req: Request, res: Response) {

    const { streamId } = req.body;

    if (!streamId) {
        throw new CustomError("Stream ID is required", 400);
    }


    try {
        const result = await prisma.stream.delete({
            where: {
                id: streamId
            }
        })

        const response = await deleteStreamDataB2(streamId)

        if (response) {
            HttpResponse.success(res,null, "Stream Deleted");
        }

    } catch (error) {
        console.log(error)
        throw new CustomError("Bad request", 404)
    }



}


export async function updateStreamOnLive(req: Request, res: Response) {

    const { streamId, title } = req.body;

    if (!title) {
        throw new CustomError("Title is required", 400);
    }
    try {

        await prisma.stream.update({
            where: {
                id: streamId
            },
            data: {
                title
            }
        })

        HttpResponse.success(res);

    } catch (error) {
        console.log(error)
        throw error;
    }

}


export async function obsStream(req: Request, res: Response) {
    const streamId = req.query.streamId?.toString()

    if (!streamId) throw new CustomError("Invalid Query", 404);

    const endpoint = "http://127.0.0.1:9997/v3/paths/list";
    const result = await axiosHandler(endpoint, null, null, "GET");

    if (!result || (Array.isArray(result.items) && result.items.length == 0)) {
        throw new CustomError("Obs not connected with Media server", 404)
    }

    const verifyStream = result.items.filter((data: any) => data.name.replace("live/", "") === streamId);

    if (!verifyStream[0].ready) {
        throw new CustomError("Stream is not ready", 404);
    }



    HttpResponse.success(res, {}, "Obs stream is live now", 200);

}
