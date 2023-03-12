import { sendResponse } from "../lib/HttpResponse";
import { NextFunction, Request, Response } from "express";
import { HttpStatusCode } from "../lib/HttpStatus";
import logger from "../lib/logger";

export function isUserAuthenticated(req: Request, res: Response, next: NextFunction) {
  logger.debug("In isUserAuthenticated middleware");
  if (req.user) {
    next();
  } else {
    return sendResponse(res, HttpStatusCode.UNAUTHORIZED, "Unauthorized access. Please login.");
  }
}
