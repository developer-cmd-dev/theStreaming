import type { Response } from "express";

class HttpResponse {
    static success(res:Response, data:object|null = null, message = 'Success', status = 200) {
        return res.status(status).json({
            success: true,
            status,
            message,
            data,
        });
    }

    // static error(res:Response, message = 'Error', status = 500, error = null) {
    //     // Optionally include full error in development
    //     return res.status(status).json({
    //         success: false,
    //         status,
    //         message,
    //         error: process.env.NODE_ENV === 'development' ? error : undefined,
    //     });
    // }
}

export default HttpResponse;