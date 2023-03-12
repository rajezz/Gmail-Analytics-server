import { NextFunction, Request, Response } from "express";
import util from "util";
import passport from "passport";

import logger from "../lib/logger";
import { FetchAPI } from "../lib/axios";
import { GOOGLE_THREAD_URL } from "../_data/urls";
import { UserDocument } from "../types/user";
import { getAccessToken } from "../services/google";
import { getGoogleAPIOption } from "../lib/utils";
import { sendResponse } from "../lib/HttpResponse";
import { HttpStatusCode } from "../lib/HttpStatus";
import { SCOPE_PREFERENCES } from "../_data/constant";

/**
 * API Route: GET /api/google/login
 * @export
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 * @return {*}
 */
export function loginWithGoogleSSO(req: Request, res: Response, next: NextFunction): any {
    const scopePref = req.params?.scopePref || "all";
    logger.debug("scopePref: " + scopePref);
    return passport.authenticate("google", {
        scope: ["profile", "email", ...SCOPE_PREFERENCES[scopePref]],
        accessType: "offline",
    })(req, res, next);
}
export async function getEmails(req: Request, res: Response) {
    logger.debug("In getEmails");
    logger.debug(`User: ${util.inspect(req?.user, false, 3, true)}`);
    const { refreshToken } = req?.user as UserDocument;

    const accessToken = await getAccessToken(refreshToken);
    if (!accessToken) {
        return;
    }

    const [error, response] = await FetchAPI(
        `${GOOGLE_THREAD_URL}?maxResults=500`,
        getGoogleAPIOption(accessToken)
    );

    if (error || response?.status !== HttpStatusCode.OK.status) {
        logger.error(`Error while fetching Gmail threads: ${util.inspect(error, false, 3, true)}`);
        return sendResponse(
            res,
            HttpStatusCode.SERVER_ERROR,
            "Couldn't get Emails",
            error.toJSON()
        );
    }

    logger.debug(`Gmail threads: ${util.inspect(response.data, false, 3, true)}`);
    return sendResponse(res, HttpStatusCode.OK, "Successfully fetched Emails", response.data);
}
