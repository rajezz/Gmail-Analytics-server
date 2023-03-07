import { sendResponse } from "../lib/HttpResponse";
import { NextFunction, Request, Response } from "express";
import { HttpStatusCode } from "../lib/HttpStatus";

export function isUserAuthenticated(req: Request, res: Response, next: NextFunction) {
  if (req.user) {
    next();
  } else {
    return sendResponse(res, HttpStatusCode.UNAUTHORIZED, "Unauthorized access. Please login.");
  }
}
