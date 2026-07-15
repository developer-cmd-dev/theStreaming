import type { NextFunction, Request, Response } from "express";

import jwt, { JsonWebTokenError } from "jsonwebtoken";
import { CustomError } from "../error/customError";
import HttpResponse from "../utils/HttpResponse";




const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY as string;
export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization;
    let { refresh_token } = req.cookies;
    try {
        // if (refresh_token) {
        //   <jwt.UserJwtPayload>jwt.verify(refresh_token, JWT_SECRET_KEY);
            if (token && token.startsWith("Bearer ")) {
                const extractedToken = token.split(" ")[1];
                if (extractedToken) {
                    const verify = <jwt.UserJwtPayload>jwt.verify(extractedToken, JWT_SECRET_KEY);
                    req.userId = verify.userId
                    req.username = verify.username
                    next()
                }
            }
        // }else {
        //     res.status(401).json({ message: "No refresh token provided" });
       
        // }
    } catch (error) {
        if (error instanceof JsonWebTokenError) {
            throw new CustomError(error.message, 401);
        }
    }

}


