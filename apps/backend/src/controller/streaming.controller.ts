import { createStreamSchema } from "@repo/zod/schema";
import type { Request, Response } from "express";
import { CustomError } from "../error/customError";
import { prisma } from "@repo/db/prisma";
import HttpResponse from "../utils/HttpResponse";
import  axios, { AxiosError } from 'axios';

export async function createStream(req:Request,res:Response) {
    
  try {
    const {data:streamConfig,error}=createStreamSchema.safeParse(req.body);


    if (error) {
        const errorMessage = JSON.parse(error.message)[0].message
        throw new CustomError(errorMessage, 422);
    }

    const response =await prisma.stream.create({
        data:{
            title:streamConfig.title,
            description:streamConfig.description,
            thumbnail:streamConfig.thumbnail,
            isLive:streamConfig.isLive,
            subscriberOnly:streamConfig.subscriberOnly,
            userId:req.userId
        }
    })

    HttpResponse.success(res,{streamId:response.id});
  } catch (error) {
   throw new CustomError("Failed to create stream",500)
  }

}


export async function connectMediaServer(req: Request, res: Response) {
    try {
        // Basic input validation
        const { sdp, streamId } = req.body ?? {};
        if (!sdp || typeof sdp !== 'string') {
            throw new CustomError("Missing or invalid 'sdp' in the request body.", 400);
        }
        if (!streamId || typeof streamId !== 'string') {
            throw new CustomError("Missing or invalid 'streamId' in the request body.", 400);
        }

        // Ensure stream exists and user owns it (optional: add authorization logic if required)
        const stream = await prisma.stream.findUnique({
            where: {id: streamId },
            select: { id: true, userId: true }
        });
        if (!stream) {
            throw new CustomError("Stream not found.", 404);
        }
        if (req.userId && stream.userId !== req.userId) {
            throw new CustomError("Unauthorized access to this stream.", 403);
        }

        // Send offer SDP to media server
        const whipEndpoint = `http://localhost:8889/live/${streamId}/whip`;
        const whipResponse = await axios.post(
            whipEndpoint,
            sdp,
            { headers: { "Content-Type": "application/sdp" } }
        );

        // Return SDP answer in a clear format
        HttpResponse.success(res, { sdpAnswer: whipResponse.data });
    } catch (error) {
        if (error instanceof AxiosError) {
            // Log error, return a structured error message to client
            const status = error.response?.status || 500;
            const message = error.response?.data || 'Error communicating with media server';
            throw new CustomError(message,status)
        }
    }
}

export async function endStream(req:Request,res:Response) {
    
}