import { streamSchema, type CreateStreamInput, type HttpResponse } from "@repo/zod/schema";
import {axiosHandler,type AxiosPayload} from "@repo/axios"
import { CustomError } from "@repo/customError";

export class Tools {

     private static HTTP_URL:string = process.env.HTTP_SERVER_URL ?? ""


     static async createStream(streamData:CreateStreamInput,accessToken?:string):Promise<{streamId:string}>{
        try {
            const axiosPayload:AxiosPayload = {
                // TODO: Move this API base URL to env config instead of hardcoding localhost.
                url:`${this.HTTP_URL}/create-stream`,
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


