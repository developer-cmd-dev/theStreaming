import axios, { Axios, AxiosError } from "axios";
import {z, type HttpResponse} from '@repo/zod/schema'
import { CustomError } from "@repo/customError";
export interface AxiosPayload {
    url: string,
    method: 'get' | 'GET' | 'delete' | 'DELETE' | 'head' | 'HEAD' | 'options' | 'OPTIONS' | 'post' | 'POST' | 'put' | 'PUT' | 'patch' | 'PATCH',
    baseURL?: string,
    headers?: Record<string, string>,
    params?: Record<string, any>,
    data?: any,
    timeout?: number,
    auth?: {
        username: string;
        password: string;
    },
    responseType?: 'arraybuffer' | 'blob' | 'document' | 'json' | 'text' | 'stream',
    maxRedirects?: number,
    paramsSerializer?: (params: Record<string, any>) => string,
    withCredentials?: boolean,
    onUploadProgress?: (progressEvent: any) => void,
    onDownloadProgress?: (progressEvent: any) => void,
    signal?: AbortSignal,
    validateStatus?: (status: number) => boolean,
    xsrfCookieName?: string,
    xsrfHeaderName?: string,
}




export async function axiosHandler<T=any>(data:AxiosPayload):Promise<T> {
    try {
        const response =await axios(data);
        return response.data as T
    } catch (error) {
        if (error instanceof AxiosError) {
  

            const status = error.response?.status ?? 500;
           
            const message = typeof error.response?.data == "object" ?
                            error.response.data.message :
                            error.message ||
                            "Something went wrong"
            throw new CustomError(message,status)    
            
        }

    throw new CustomError("Unexpected Error",500)
    }
}
    
