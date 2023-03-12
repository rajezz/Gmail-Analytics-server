import logger from "../lib/logger";
import { NextFunction, Request, Response } from "express";
import { sendResponse } from "../lib/HttpResponse";
import { HttpStatusCode } from "../lib/HttpStatus";
import { trimObject } from "../lib/utils";
import { findUserDoc, upsertUserDoc } from "../services/UserProvider";
import util from "util";
import { UserDocument } from "../types/user";
import { generateAPIKEY } from "@/lib/apikey";

export function sendUser(req: Request, res: Response) {
    return sendResponse(res, HttpStatusCode.OK, "User details", {
        user: trimObject(req.user || {}, UserPropertyList),
    });
}

export async function retrieveApiKey(req: Request, res: Response) {
    try {
        const user = req.user as UserDocument;
        if (typeof user.apiKey === "undefined") {
            user.apiKey = generateAPIKEY(user.email, user.googleId);
        }
        const [error, response] = await upsertUserDoc(user);

        if (error) {
            logger.error(
                `Error while finding/storing API Key in user document. Error: ${util.inspect(
                    error,
                    false,
                    3,
                    true
                )}`
            );
            return sendResponse(
                res,
                HttpStatusCode.SERVER_ERROR,
                "Couldn't generate API Key",
                error
            );
        }

        return sendResponse(res, HttpStatusCode.OK, "API Key generated successfully", {
            key: response.user.apiKey,
        });
    } catch (error) {
        return sendResponse(res, HttpStatusCode.SERVER_ERROR, "Couldn't retrieve API Key", error);
    }
}
