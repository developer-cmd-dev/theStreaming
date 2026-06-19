import type { Request, Response } from "express";
import { CustomError } from "../error/customError";

export async function healthCheck(req:Request,res:Response) {
    try {
      throw new CustomError("Poor Health",503)

        res.status(200).json("Healthy");
    } catch (error) {
      throw new CustomError("Poor Health",503)
    }
}