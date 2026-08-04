import { streamSchema, type CreateStreamInput, type HttpResponse } from "@repo/zod/schema";
import {axiosHandler,type AxiosPayload} from "@repo/axios"
import { CustomError } from "@repo/customError";

export class Tools {



    public async createStream(streamData:CreateStreamInput):Promise<{streamId:string}>{
        try {
            const axiosPayload:AxiosPayload = {
                url:"http://localhost:3000/api/v1/create-stream",
                method:'POST',
                data:streamData,
                headers:{
                    "Authorization":"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJmYTIwMWQxZi0xZTM4LTQwMDItOTRiOC00ZGRjYjNhZWQxOGYiLCJ1c2VybmFtZSI6InRib25lZ2FtaW5nIiwiaWF0IjoxNzg1ODM4MzU1LCJleHAiOjE3ODU4NDkxNTV9.j_ZWH2wyfEaxs3iT1EkxjAT351rJ-Ra5BEfPxkx7dXg"
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


