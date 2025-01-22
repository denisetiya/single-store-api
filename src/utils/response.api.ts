import { Response } from "express";

const response = (
    res: Response,
    status: number,
    message: string,
    errors: any = null,
    contents: any = null,
    meta: any = null
) => {
    res.status(status).json({
        statusCode: status,
        message,
        ...(errors && { errors }), 
        ...(contents && { contents }),
        ...(meta && { meta }),
    });
};

export default response;
