import { errorTypeRegistries } from "@aws-sdk/client-s3";
import { prisma } from "@repo/db/prisma";
import { UsernameSearchQuerySchema } from "@repo/zod/schema";
import type { Request, Response } from "express";
import { CustomError } from "../error/customError";
import HttpResponse from "../utils/HttpResponse";

export async function searchUser(req: Request, res: Response) {

    try {
        const { data, error } = UsernameSearchQuerySchema.safeParse(req.query)



        if (error) {
            const errorMessage = JSON.parse(error.message)[0].message
            throw new CustomError(errorMessage, 422);
        }



        const users = await prisma.user.findMany({
            where: {
                username: {
                    contains: data.query,
                    mode: "insensitive",
                },
            },
            take: Number(data.limit),
            select: {
                id: true,
                username: true,
            },
        });

        console.log(users)
        HttpResponse.success(res, users, "success", 200)

    } catch (error) {
        console.log(error);
        throw error
    }
}