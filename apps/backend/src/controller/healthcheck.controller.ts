import type { Request, Response } from "express";
import { CustomError } from "../error/customError";

export async function healthCheck(req:Request,res:Response) {
    try {

        res.status(200).json({name:"The streaming Server",health:"Perfect"});
    } catch (error) {
      throw new CustomError("Poor Health",503)
    }
}