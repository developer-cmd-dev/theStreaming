import { prisma } from "@repo/db/prisma";
import HttpResponse from "../utils/HttpResponse";
import { response, type Request, type Response } from "express";

export async function liveStreams(req:Request,res: Response) {

  try {
    const result = await prisma.user.findMany({
        where: {
            streams: {
                some: {
                    isLive: true
                }
            }
        },
        include: {
            streams: {
                where: {
                    isLive: true
                }
            },
            _count: {
                select: {
                    subscribers: true
                }
            },
        },
        orderBy: {
            subscribers: {
                _count: "desc",
            }
        },

        take: 10

    })

    HttpResponse.success(res,result,"success",200)

    

  } catch (error) {
    console.log(error);
    throw error
  }




}