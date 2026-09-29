import type { NextFunction, Request, Response } from "express";

import jwt, { JsonWebTokenError } from "jsonwebtoken";
import { CustomError } from "../error/customError";
import HttpResponse from "../utils/HttpResponse";




const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY as string;
export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
    let { refresh_token, access_token } = req.cookies;
    try {
        const verify = <jwt.UserJwtPayload>jwt.verify(access_token, JWT_SECRET_KEY);
        req.userId = verify.userId
        req.username = verify.username
        next()
    } catch (error) {
        if (error instanceof JsonWebTokenError) {
            if(error.name==='TokenExpiredError'){
              try {
                  const payload = <jwt.UserJwtPayload> jwt.verify(refresh_token, JWT_SECRET_KEY);
                  req.userId=payload.userId;
                  return next()
              }catch(error){
                if(error instanceof JsonWebTokenError){
                    if(error.message==='TokenExpiredError'){
                        throw new CustomError(`Unauthorized:${error.message}`, 401);
                    }
                }
              }
            }
            throw new CustomError(`Unauthorized:${error.message}`, 401);
        }
    }

}


