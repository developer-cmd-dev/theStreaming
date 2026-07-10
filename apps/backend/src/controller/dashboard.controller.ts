import { prisma } from "@repo/db/prisma";
import type { Response } from "express";

export async function liveStreams(res: Response) {

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

    console.log(result);

    

  } catch (error) {
    console.log(error)
  }




}