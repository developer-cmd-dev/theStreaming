import axios, { AxiosError } from "axios";
import { CustomError } from "../error/customError";

/**
 * 
 * @param url - The endpoint URL.
 * @param data - The request payload (for POST, PUT, PATCH etc).
 * @param headers - Optional headers for the request.
 * @param method - HTTP method (GET, POST, PUT, DELETE, PATCH).
 * @returns Response data from the endpoint.
 * @throws CustomError with a detailed message and status code on failure.
 */
export async function axiosHandler<T = any>(
    url: string,
    data: object | string | number | null = null,
    headers: Record<string, string> | null = null,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
): Promise<T> {
    try {
        const config = {
            method: method.toLowerCase() as any, 
            url,
            headers: headers ?? {},
            ...(data != null ? { data } : {}),
        };

        const response = await axios(config);
        return response.data as T;
    } catch (error: any) {
        if (error instanceof AxiosError) {
            // Extract as much debug info as possible
            const status = error.response?.status ?? 500;
            const message =
                typeof error.response?.data === "string"
                    ? error.response.data
                    : error.response?.data?.message ||
                      error.message ||
                      "Something went wrong";
            // Log more error details for debugging
            console.error("Axios error:", {
                url,
                method,
                status,
                data,
                headers,
                message,
                raw: error.response?.data,
            });
            throw new CustomError(message, status);
        }
        // Log unexpected errors too
        console.error("Unexpected error in axiosHandler:", error);
        throw new CustomError("Unexpected error executing HTTP request", 500);
    }
}