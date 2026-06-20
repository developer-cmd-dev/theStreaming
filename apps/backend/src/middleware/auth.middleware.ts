import type { NextFunction, Request, Response } from "express";

import jwt, { JsonWebTokenError } from "jsonwebtoken";
import { CustomError } from "../error/customError";




const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY as string;
export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization
    if (token && token.startsWith("Bearer ")) {
        const extractedToken = token.split(" ")[1];
        if (extractedToken) {
            try {

                const verify = <jwt.UserJwtPayload>jwt.verify(extractedToken, JWT_SECRET_KEY);
                req.userId = verify.userId
                req.username = verify.username
                next()
            } catch (error) {
                if (error instanceof JsonWebTokenError) {
                    throw new CustomError("SessionTimedOut", 401);
                }
            }
        }

    } else {
        throw new CustomError("Invalid Token", 401)

    }

}


