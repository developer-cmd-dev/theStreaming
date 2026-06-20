import { createUserSchema, publicUserSchema } from "@repo/zod/zod";
import type { Request, Response } from "express";
import { ZodError } from "zod";
import { CustomError } from "../error/customError";
import { prisma } from '@repo/db/prisma'
import HttpResponse from "../utils/HttpResponse";
import { loginUserScheam } from "../../../../packages/zod/schema/user";
import jwt, { JsonWebTokenError, TokenExpiredError, verify } from "jsonwebtoken";


const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY as string;


export async function signUp(req: Request, res: Response) {



    const { data: userData, error } = createUserSchema.safeParse(req.body);

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
        data: {
            ...userData,
            password: await Bun.password.hash(userData.password)
        }
    })


    const { data: responseData } = publicUserSchema.safeParse(createdUser)
    HttpResponse.success(res, responseData)




}


export async function login(req: Request, res: Response) {
    const { data: userCredential, error } = loginUserScheam.safeParse(req.body);


    if (error) {
        throw new CustomError(error.message, 422);
    }


    const getUser = await prisma.user.findFirst({
        where: {
            username: userCredential.username
        }
    })


    if (!getUser) throw new CustomError("User not found!", 404);

    const verifyPassword = await Bun.password.verify(userCredential.password, getUser.password);
    if (!verifyPassword) {
        throw new CustomError("Invalid password!", 401);
    }

    const payload = {
        userId: getUser.id,
        username: getUser.username
    }
    const access_token = jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: "1m" });
    const refresh_token = jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: "30d" });
    const existingRefreshToken = await prisma.refreshToken.findFirst({
        where: {
            userId: getUser.id
        }
    });

    if (!existingRefreshToken) {
        await prisma.refreshToken.create({
            data: {

                token: refresh_token,
                userId: getUser.id
            }
        })
    } else {
        await prisma.refreshToken.update({
            where: {
                userId: getUser.id
            },
            data: {
                token: refresh_token
            }
        })
    }
    res.cookie("refresh_token", refresh_token, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 30 * 24 * 60 * 60 * 1000 // 7 days

    })

    const { data: responseData } = publicUserSchema.safeParse(getUser);

    HttpResponse.success(res, { ...responseData, access_token });
}

export async function refreshToken(req: Request, res: Response) {
    const refreshToken = req.cookies.refresh_token;
    if (refreshToken) {
        try {
            const verify = <jwt.UserJwtPayload>jwt.verify(refreshToken, JWT_SECRET_KEY)
            const access_token = jwt.sign({ userId: verify?.userId, username: verify.username }, JWT_SECRET_KEY, { expiresIn: "1m" })
            HttpResponse.success(res, { access_token })
        } catch (error) {
            if (error instanceof JsonWebTokenError) {
                throw new CustomError("SessionTimeout", 404);
            }
        }

    }
}