import { streamSchema, type CreateStreamInput, type HttpResponse } from "@repo/zod/schema";
import {axiosHandler,type AxiosPayload} from "@repo/axios"
import { CustomError } from "@repo/customError";

export class Tools {



     static async createStream(streamData:CreateStreamInput,accessToken?:string):Promise<{streamId:string}>{
        try {
            const axiosPayload:AxiosPayload = {
                url:"http://localhost:3000/api/v1/create-stream",
                method:'POST',
                data:streamData,
                headers:{
                    "Authorization":accessToken? `Bearer ${accessToken}` : ""
                }
            }
            const response = await axiosHandler<HttpResponse<{streamId:string}>>(axiosPayload);
            
            return response.data;
        } catch (error) {
            if(error instanceof CustomError){
                console.log(error)
                throw error
            }
            throw new CustomError("Something went wrong",500)

        }

    }


    


    


    
}


