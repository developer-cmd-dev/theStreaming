import { streamSchema, type CreateStreamInput, type HttpResponse } from "@repo/zod/schema";
import {axiosHandler,type AxiosPayload} from "@repo/axios"

export class Tools {



    public async createStream(streamData:CreateStreamInput):Promise<{streamId:string}>{
        try {
            const axiosPayload:AxiosPayload = {
                url:"http://localhost:3000/api/v1/create-stream",
                method:'POST',
                data:streamData,
                headers:{
                    "Authorization":"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJmYTIwMWQxZi0xZTM4LTQwMDItOTRiOC00ZGRjYjNhZWQxOGYiLCJ1c2VybmFtZSI6InRib25lZ2FtaW5nIiwiaWF0IjoxNzg1NzM4NzU2LCJleHAiOjE3ODU3NDk1NTZ9.O9tnz2G4yW2cMZ5iJufFAmtlGpcEfZfdZSQ13uEToSY"
                }
            }
            const response = await axiosHandler<HttpResponse<{streamId:string}>>(axiosPayload);

            return response.data;
        } catch (error) {
            throw error;
        }

    }


    


    
}


