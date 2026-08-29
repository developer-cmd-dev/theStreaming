import { response, type Request, type Response } from "express";
import { CustomError } from "../error/customError";
import axios, { AxiosError } from "axios";
import { axiosHandler } from "../lib/axios";
import { prisma } from "@repo/db/prisma";
import HttpResponse from "../utils/HttpResponse";
import { publicUserSchema, type PublicUser } from "@repo/zod/schema";
import jwt from 'jsonwebtoken'


const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY as string;
const GOOGLE_REDIRECT_URI_LOGIN= process.env.GOOGLE_REDIRECT_URI_LOGIN!
const GOOGLE_REDIRECT_URI_SIGNUP=process.env.GOOGLE_REDIRECT_URI_SIGNUP!

export const googleAuthCodeVerifier = async (req: Request, res: Response) => {
  const { authCode, code_verifier, from } = req.body;

  if (!authCode && code_verifier) throw new CustomError("Missing Google OAuth authorization code.", 400);


  try {

    const data = new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      code: authCode,
      code_verifier,
      redirect_uri: from === 'signup' ? GOOGLE_REDIRECT_URI_SIGNUP :GOOGLE_REDIRECT_URI_LOGIN,
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



    const existedUser = await prisma.user.findFirst({
      where: {
        email: googleUserInfo.data.email
      }
    })

    if (existedUser) {
      const {data,error}=publicUserSchema.safeParse(existedUser);
      
      const { access_token, refresh_token } = generateToken({ userId: existedUser.id, username: existedUser.username });
      setTokenCookie(res, refresh_token, access_token)
      HttpResponse.success(res, data);
      return
    }else{
      if(from==='login'){
        throw new CustomError("User not found", 404);
      }
    }

    const username = googleUserInfo.data.email.substring(0, googleUserInfo.data.email.indexOf("@"));

    const createdNewUser = await prisma.user.create({
      data: {
        name: googleUserInfo.data.name,
        email: googleUserInfo.data.email,
        username,
        avatar: googleUserInfo.data.picture
      }
    })

    const payload = {
      userId: createdNewUser.id,
      username: createdNewUser.username
    }


    const { access_token, refresh_token } = generateToken(payload)
    setTokenCookie(res, access_token, refresh_token)



    await prisma.refreshToken.create({
      data: {

        token: refresh_token,
        userId: createdNewUser.id
      }
    })


    const { data: responseData } = publicUserSchema.safeParse(createdNewUser);

    HttpResponse.success(res, responseData);
  }

  catch (error) {

    if (error instanceof AxiosError) {
      console.log(error.response?.data)
    }else if(error instanceof CustomError){
    throw new CustomError(error.message,error.statusCode);
    }

    throw new CustomError("Something went wrong try again leter!", 500);
  }

};



function setTokenCookie(res: Response, refresh_token: string, access_token: string) {

  res.cookie("refresh_token", refresh_token, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days

  })
  res.cookie("access_token", access_token, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 3 * 60 * 60 * 1000 // 3 hours
  })

  return response
}


function generateToken(userPayload: { userId: string, username: string }): { access_token: string, refresh_token: string } {

  const access_token = jwt.sign(userPayload, JWT_SECRET_KEY, { expiresIn: "3h" });
  const refresh_token = jwt.sign(userPayload, JWT_SECRET_KEY, { expiresIn: "30d" });
  return { refresh_token, access_token }
} 