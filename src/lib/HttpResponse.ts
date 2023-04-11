import { Response } from "express";
import util from "util";

import logger from "./logger";

interface ResponseData {
    res: Response;
    status: number;
    message: string;
    data?: any;
}

export function sendErrorResponse({ res, status, message, data }: ResponseData) {
    logger.error(`${message} Error: ${util.inspect(data, false, 3, true)}`);
    return sendResponse({ res, status, message, data });
}

export function sendResponse({ res, status, message, data }: ResponseData) {
    logger.info(`Sending response with status ${status} & message ${message}`);

    res.statusMessage = message;
    res.status(status).json(data);
}
