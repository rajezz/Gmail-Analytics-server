import { fork, ChildProcess } from "node:child_process";
import path from "node:path";
import util from "util";

import { IMPORT_ACTIONS } from "../_data/import";
import logger from "../lib/logger";

// import { GoogleAPIHandler } from "./GoogleAPIHandler";
import { UserDocument } from "../models/User";
import { ImportDocument } from "../models/Import";

export class ImportJob {
    private handleMessage(message: any, callback: any) {
        logger.info("In ImportJob:handelMessage");
        logger.info(`Incoming message: ${util.inspect(message, false, 3)}`);
        return callback("From ImportJob:handelMessage");
    }
    private handleError(message: any, callback: any) {
        throw new Error("Method not Implemented");
    }
    private handleExit(message: any, callback: any) {
        throw new Error("Method not Implemented");
    }

    // Public Methods...

    childProcess: ChildProcess | undefined;

    constructor(public user: UserDocument, public importDetails: ImportDocument) {}

    start() {
        return new Promise<Array<any>>((resolve) => {
            const callback = (error: Error | null) => {
                if (error != null) {
                    logger.error(
                        `Error received from Import process. Error: ${util.inspect(error)}`
                    );
                    resolve([error]);
                }
                return resolve([null, "Start Import process started"]);
            };
            this.childProcess?.send(
                {
                    action: IMPORT_ACTIONS.START_IMPORT,
                    payload: JSON.stringify({ user: this.user, importDetails: this.importDetails }),
                },
                callback
            );
        });
    }

    initialize() {
        // Use Import.js since the ts files will be transcripted into js files.
        this.childProcess = fork(`${path.join(__dirname, "./ChildProcess/Import.js")}`);

        // Initialize the child process events
        process.on("message", this.handleMessage);
        process.on("error", this.handleError);
        process.on("exit", this.handleExit);

        return this.childProcess;
    }
}
