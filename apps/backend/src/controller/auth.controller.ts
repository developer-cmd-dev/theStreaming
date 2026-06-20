import { createUserSchema, publicUserSchema } from "@repo/zod/zod";
import type { Request, Response } from "express";
import { ZodError } from "zod";
import { CustomError } from "../error/customError";
import { prisma } from '@repo/db/prisma'
import HttpResponse from "../utils/HttpResponse";


export async function signUp(req: Request, res: Response) {



    const { data:userData, error } = createUserSchema.safeParse(req.body);

    if (error) {
        const errorMessage = JSON.parse(error.message)[0].message
        throw new CustomError(errorMessage, 422);
    }

    const existingUser = await prisma.user.findFirst({
        where: {
            email: userData.email,
        }
    });

    if (existingUser) {
        throw new CustomError("Email already exist!", 409);
    }

    const existingUsername = await prisma.user.findFirst({
        where: {
            username: userData.username
        }
    })


    if (existingUsername) {
        throw new CustomError("Username already exist!", 409);
    }


    const createdUser = await prisma.user.create({
        data:{
            ...userData,
            password:await Bun.password.hash(userData.password)
        }
    })


    const { data: responseData } = publicUserSchema.safeParse(createdUser)
    HttpResponse.success(res, responseData)




}