import { Request, Response } from "express";
import util from "util";

import logger from "../lib/logger";
import { sendResponse, sendErrorResponse } from "../lib/HttpResponse";
import { trimObject } from "../lib/utils";
import { UserDocument } from "../models/User";
import { generateAPIKEY } from "../lib/apikey";
import { UserClientPropertyList } from "../_data/user";
import { createKeyDoc, findKeyDoc } from "../services/MongoProviders/Key";
import { HttpStatus } from "../lib/HttpStatus";

/* GET /logout
 *
 * This route logs the user out.
 */
export function logoutUser(req: Request, res: Response) {
    req.logout({ keepSessionInfo: false }, (error: any) => {
        if (error != undefined) {
            logger.error(`Error while logging out. Error: ${util.inspect(error, true, 3, true)}`);
            return sendErrorResponse({
                res,
                status: HttpStatus.SERVER_ERROR,
                message: "Logout failed.",
                data: error,
            });
        }
        return sendResponse({ res, status: HttpStatus.OK, message: "Successfully logged out." });
    });
}

/**
 * GET /user/authenticate
 *
 * Send the User details
 * @param {Request} req Express Request object
 * @param {Response} res Express Response object
 */
export function sendUser(req: Request, res: Response) {
    logger.info("In sendUser");
    logger.info(`User: ${(<UserDocument>req.user).email}`);
    const trimmedUser = trimObject(req.user || {}, UserClientPropertyList);
    // logger.info(`trimmedUser: ${util.inspect(trimmedUser, false, 3, true)}`);

    return sendResponse({
        res,
        status: HttpStatus.OK,
        message: "User details",
        data: {
            user: trimmedUser,
        },
    });
}

export async function retrieveApiKey(req: Request, res: Response) {
    try {
        const user = req.user as UserDocument;

        const [fetchError, keyDoc] = await findKeyDoc({ googleId: user.googleId });

        if (fetchError) {
            return sendErrorResponse({
                res,
                status: HttpStatus.SERVER_ERROR,
                message: fetchError.message || "Error while fetching API Key.",
                data: fetchError,
            });
        }

        if (keyDoc?.apiKey) {
            return sendResponse({
                res,
                status: HttpStatus.OK,
                message: "API Key generated successfully",
                data: {
                    key: keyDoc.apiKey,
                },
            });
        }

        const apiKey = generateAPIKEY(user.email, user.googleId);

        const [saveError, saveResponse] = await createKeyDoc({ googleId: user.googleId, apiKey });

        if (saveError) {
            return sendErrorResponse({
                res,
                status: HttpStatus.SERVER_ERROR,
                message: saveError.message || "Error while storing API Key.",
                data: saveError,
            });
        }

        return sendResponse({
            res,
            status: HttpStatus.OK,
            message: "API Key generated successfully",
            data: {
                key: saveResponse.apiKey,
            },
        });
    } catch (error: any) {
        return sendErrorResponse({
            res,
            status: HttpStatus.SERVER_ERROR,
            message: error?.message || "Error while fetching/storing API Key.",
            data: error,
        });
    }
}
