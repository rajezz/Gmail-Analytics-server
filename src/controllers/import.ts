import { findByQuery } from "../services/MongoProviders/common";
import { NextFunction, Request, Response } from "express";
import util from "util";

import logger from "../lib/logger";
import { Import, ImportDocument } from "../models/Import";
import { UserDocument } from "../types/user";
// import { Job } from "../services/Job";
import { sendErrorResponse } from "../lib/HttpResponse";
import { HttpStatus } from "../lib/HttpStatus";
import { ImportJob } from "../services/ImportJob";
import MongoError from "../lib/MongoError";

const importJobList: Array<ImportJob> = [];

/**
 * API Route: GET /api/import/start
 * @export
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 * @return {Promise<any>}
 */
export async function startImport(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
        const user = <UserDocument>req.user;
        logger.debug("In startImport");
        logger.debug(`User: ${user.email}`);

        const [error, response] = await findByQuery<ImportDocument>(Import, {
            googleId: user.googleId,
        });

        // if (response) {
        //     return sendErrorResponse({
        //         res,
        //         status: HttpStatus.NOT_ACCEPTABLE_ERROR,
        //         message:
        //             "Couldn't start Import Job. Already an import job exists. Try using: 'GET /api/import/resume'",
        //     });
        // }

        if (error instanceof MongoError) {
            return sendErrorResponse({
                res,
                status: HttpStatus.NOT_ACCEPTABLE_ERROR,
                message: error.message,
                data: error.toObj(),
            });
        }

        const importJob = new ImportJob(user, <ImportDocument>response);

        importJobList[user.googleId] = importJob;

        importJob.initialize();

        const [startError] = await importJob.start();

        if (startError) {
            return sendErrorResponse({
                res,
                status: HttpStatus.SERVER_ERROR,
                message: startError?.message || "Import Job Failed",
                data: startError,
            });
        }
    } catch (error) {
        return sendErrorResponse({
            res,
            status: HttpStatus.SERVER_ERROR,
            message: (<Error>error)?.message || "Import Job Failed",
            data: error,
        });
    }
}
