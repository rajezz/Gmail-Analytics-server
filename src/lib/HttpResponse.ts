import { Response } from "express";
import logger from "./logger";

export function sendResponse(res: Response, { status, code }, message: string, data?: any) {
  logger.info(`Sending response with status ${status}, code ${code} & message ${message}`);

  res.status(status).json({
    code,
    message,
    data,
  });
}
