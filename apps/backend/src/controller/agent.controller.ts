import { prisma } from "@repo/db/prisma";
import { text, type Request, type Response } from "express";
import QRCode from 'qrcode'
import jwt from 'jsonwebtoken'
import type { CreateUserInput, PublicUser } from "@repo/zod/schema";
import crypto from 'node:crypto'
import HttpResponse from "../utils/HttpResponse";
import { CustomError } from "../error/customError";

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY ?? "";

export async function connectToTheAIagent(req: Request, res: Response) {
  try {
    const id = req.userId;

    const user = <PublicUser>await prisma.user.findFirst({ where: { id } });


    const telegramBotUrl = await prisma.telegramBot.findMany();

    const url = telegramBotUrl[0]?.url;

    const qrCode = await QRCode.toDataURL(url ?? "");

    const payload = {
        userId: user.id,
        username: user.username
    }

    const jwtToken = jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: '30d' });

    const encrypt = encryption(jwtToken);

    const response = {
        qrCode,
        accessKey:encrypt,
        botLink:url
    }

    HttpResponse.success(res,response);
  } catch (error) {
    throw new CustomError("Something went wrong",500);
  }
}


const algorithm = "aes-256-cbc";
const secretKey = process.env.AI_AGENT_SECRET_KEY ?? ""


const key = crypto
    .createHash("sha512")
    .update(secretKey)
    .digest("hex")
    .substring(0, 32);

export function encryption(data: string):string {


    const iv = crypto.randomBytes(16);

    try {
        const cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv)
        let encrypted = cipher.update(data, "utf-8", "hex")
        encrypted += cipher.final("hex")

        // Package the IV and encrypted data together so it can be stored in a single
        // column in the database.
        return iv.toString("hex") + encrypted
    } catch (error) {
       throw error
    }

}

export function decrypt(data: string):string {
    try {
            // Unpackage the combined iv + encrypted message. Since we are using a fixed
    // size IV, we can hard code the slice length.
    const inputIV = data.slice(0, 32)
    const encrypted = data.slice(32)
    const decipher = crypto.createDecipheriv(
        algorithm,
        Buffer.from(key),
        Buffer.from(inputIV, "hex"),
    )

    let decrypted = decipher.update(encrypted, "hex", "utf-8")
    decrypted += decipher.final("utf-8")
    return decrypted
    } catch (error) {
        throw error
    }
}