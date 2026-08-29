import { type Request, type Response } from "express";
import { CustomError } from "../error/customError";
import axios, { AxiosError } from "axios";
import { axiosHandler } from "../lib/axios";
import { prisma } from "@repo/db/prisma";
import HttpResponse from "../utils/HttpResponse";
import { publicUserSchema, type PublicUser } from "@repo/zod/schema";
import jwt from 'jsonwebtoken'


const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY as string;

export const googleAuthCodeVerifier = async (req: Request, res: Response) => {
  const { authCode, code_verifier } = req.body;

  if (!authCode && code_verifier) throw new CustomError("Missing Google OAuth authorization code.", 400);


  try {

    const data = new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      code: authCode,
      code_verifier,
      redirect_uri: process.env.GOOGLE_REDIRECT_URI!,
      grant_type: "authorization_code",
    })

    const response = await axios.post(
      "https://oauth2.googleapis.com/token",
      data.toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        }
      }
    )

    const googleUserInfo = await axios.get(
      "https://openidconnect.googleapis.com/v1/userinfo",
      {
        headers: {
          "Authorization": `Bearer ${response.data.access_token}`
        }
      }
    )

    console.log(googleUserInfo)

    const existedUser = <PublicUser>await prisma.user.findFirst({
      where: {
        email: googleUserInfo.data.email
      }
    })

    if (existedUser) {
      HttpResponse.success(res, existedUser);
      return
    }

    const username = googleUserInfo.data.email.substring(0, googleUserInfo.data.email.indexOf("@"));

    const createdNewUser = await prisma.user.create({
      data: {
        name: googleUserInfo.data.name,
        email: googleUserInfo.data.email,
        username,
        avatar:googleUserInfo.data.avatar
      }
    })

    const payload = {
      userId: createdNewUser.id,
      username: createdNewUser.username
    }

    const access_token = jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: "3h" });
    const refresh_token = jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: "30d" });





    await prisma.refreshToken.create({
      data: {

        token: refresh_token,
        userId: createdNewUser.id
      }
    })

    res.cookie("refresh_token", refresh_token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days

    })
    res.cookie("access_token",access_token,{
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 3 * 60 * 60 * 1000 // 3 hours
    })

    const { data: responseData } = publicUserSchema.safeParse(createdNewUser);

    HttpResponse.success(res, responseData);
  }

  catch (error) {

    if (error instanceof AxiosError) {
      console.log(error.response?.data)
    }

    throw new CustomError("Something went wrong try again leter!", 500);
  }

};



