import { prisma } from "@repo/db/prisma";
import e, { text, type Request, type Response } from "express";
import QRCode from 'qrcode'
import jwt, { type JwtPayload } from 'jsonwebtoken'
import type { CreateUserInput, PublicUser } from "@repo/zod/schema";
import crypto from 'node:crypto'
import HttpResponse from "../utils/HttpResponse";
import { CustomError } from "../error/customError";

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY ?? "";

export async function connectToTheAIagent(req: Request, res: Response) {
    try {
        const id = req.userId;

        const user = <PublicUser>await prisma.user.findFirst({ where: { id } });

        const telegramBotUrl = await prisma.telegramBot.findMany();
        if(telegramBotUrl.length===0){
            throw new CustomError("Agent Bot not found!",500);
        }

        const url = telegramBotUrl[0]?.url;

        const qrCode = await QRCode.toDataURL(url ?? "");

        const payload = {
            userId: user.id,
            username: user.username
        }
        const agentConnection =await prisma.agentConnection.findFirst({
            where:{
                userId:id
            }
        })

        if(agentConnection){
            const response = {
                qrCode,
                connectionId:agentConnection.connection_id,
                botLink: url
            }
            HttpResponse.success(res, response);
            return
        }



        const jwtToken = jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: '30d' });

        const connectionId = Math.floor(10000000 + Math.random() * 90000000)
 
        const response = {
            qrCode,
            connectionId,
            botLink: url
        }
        HttpResponse.success(res, response)
    } catch (error) {

        console.log(error)
        if(error instanceof CustomError){
            throw new CustomError(error.message,error.statusCode);
        }
        throw new CustomError("Something went wrong", 500);
    }
}

export async function authenticateAgentUser(req: Request, res: Response) {



    try {

        const { username, connectionId } = req.body;


        const response = await prisma.agentConnection.findFirst({
            where: {
                connection_id: connectionId
            }
        })

        if(!response){
            throw new CustomError("Unauthorized User",401);
        }

        const verifytoken =<jwt.UserJwtPayload> jwt.verify(response.jwt_token,JWT_SECRET_KEY);

        const checkAiAgentBot = await prisma.aI_Agent_Bot.findFirst({
            where:{
                agentConnectionId:connectionId
            }
        })

        if(!checkAiAgentBot){
            const agentBotResponse =   await prisma.aI_Agent_Bot.create({
                data:{
                    telegramUsername:username,
                    agentConnectionId:connectionId,
                    userId:verifytoken.userId
                }
            })
            HttpResponse.success(res,{...agentBotResponse,jwt_token:response.jwt_token});
            return;

        }

  

        
        HttpResponse.success(res,{...checkAiAgentBot,jwt_token:response.jwt_token})
    } catch (error) {
        console.log(error)
        throw new CustomError("Something went wrong", 500);
    }



}


export async function saveAgentChats(req:Request,res:Response) {
    
    const {username,contextData}=req.body;

    if(!username){
        throw new CustomError("Invalid Username", 400);
    }


    try {
        // Check if contextData is an array
        if (!Array.isArray(contextData) || contextData.length === 0) {
            throw new CustomError("contextData must be a non-empty array.", 400);
        }

        // Find the aiAgentBotId for this username
        const aiAgentBot = await prisma.aI_Agent_Bot.findUnique({
            where: {
                telegramUsername: username
            }
        });

        if (!aiAgentBot) {
            throw new CustomError("AI Agent Bot not found for this username.", 404);
        }

        // Prepare data for bulk create
        // Each item: 'role', 'content', 'username', 'tool_name', must have aiAgentBotId
        const records = contextData.map((item: any) => ({
            role: item.role,
            content: item.content,
            username: username?? null,
            tool_name: item.tool_name ?? null,
            aiAgentBotId: aiAgentBot.id
        }));

        const saved = await prisma.userContextData.createMany({
            data: records,
        });

        HttpResponse.success(res, { success: true, count: saved.count });
        

    } catch (error) {
    if (error instanceof CustomError) {
        throw new CustomError(error.message,error.statusCode)
    } else {
        throw new CustomError("Failed to save agent chats.", 500);
    }
    }





}




