import logger from "../lib/logger";
import { Request,Response, NextFunction } from "express";
import { decodeAPIKEY } from "../lib/apikey";
import { sendErrorResponse } from "../lib/HttpResponse";
import { HttpStatus } from "../lib/HttpStatus";
import { findByQuery } from "./MongoProviders/common";
import { trimObject } from "../lib/utils";
import { UserServerPropertyList } from "../_data/user";
import { User, UserDocument } from "../models/User";

export async function authenticateUsingApiKey(req: Request, res: Response, next: NextFunction) {
    try {
        const apiKey = req.headers.authorization?.split(" ")[1];

        if (!apiKey) throw new Error("Invalid API Key");

        const str = decodeAPIKEY(apiKey);
        const splits = str.split(":");

        if (splits.length !== 2) throw new Error("Invalid API Key");

        const [error, doc] = await findByQuery<UserDocument>(User, { email: splits[0], googleId: splits[1] });

        if (error || !doc) {
            logger.error("MongoError:", error);

            throw new Error("Invalid API Key");
        }

        req.user = trimObject(doc, UserServerPropertyList);
        next();
    } catch (error: any) {
        logger.error(`${error?.message} Error:`, error);
        return sendErrorResponse({
            res,
            status: HttpStatus.UNAUTHORIZED,
            message: error?.message || "",
            data: error,
        });
    }
}
