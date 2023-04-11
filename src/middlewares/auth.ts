import { sendResponse } from "../lib/HttpResponse";
import { NextFunction, Request, Response } from "express";
import { HttpStatus } from "../lib/HttpStatus";
import logger from "../lib/logger";
import { authenticateUsingApiKey } from "../services/user";

export function authenticateUser(req: Request, res: Response, next: NextFunction) {
    if (req.headers?.authorization) {
        return authenticateUsingApiKey(req, res, next);
    }
    return isUserAuthenticated(req, res, next);
}

export function isUserAuthenticated(req: Request, res: Response, next: NextFunction) {
    logger.debug("In isUserAuthenticated middleware");
    if (req.user) {
        next();
    } else {
        return sendResponse({
            res,
            status: HttpStatus.UNAUTHORIZED,
            message: "Unauthorized access. Please login.",
        });
    }
}
