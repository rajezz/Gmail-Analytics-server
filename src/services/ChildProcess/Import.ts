import util from "util";

import { IMPORT_ACTIONS } from "../../_data/import";
import logger from "../../lib/logger";
import { GoogleAPIHandler } from "../GoogleAPIHandler";
import { UserDocument } from "../../models/User";
import { fetchThreadList } from "./gmail";

// import { GoogleAPIHandler } from '../GoogleAPIHandler';
import { ImportDocument } from "../../models/Import";
import { getPageToken } from "../MongoProviders/EmailList";
process.on("message", handleMessage);
process.on("error", handleError);
process.on("exit", handleExit);

interface EventMessage {
    action: IMPORT_ACTIONS;
    payload: any;
}

let googleAPIHandler: GoogleAPIHandler | undefined = undefined;

async function handleMessage(message: EventMessage) {
    logger.info("In ChildProcess:handelMessage");
    logger.info(`Incoming message: ${util.inspect(message, false, 3)}`);

    switch (message.action) {
        case IMPORT_ACTIONS.INITIALIZE_API:
            initializeGoogleAPI(message.payload);
            break;
        case IMPORT_ACTIONS.START_IMPORT:
            await doImport(JSON.parse(message.payload));
            break;

        default:
            logger.warn(`Not supported action: ${message.action}`);
    }
}
function handleError(message: any) {
    throw new Error("Method not Implemented");
}
function handleExit(message: any) {
    throw new Error("Method not Implemented");
}

async function initializeGoogleAPI(payload: any) {
    if (typeof payload?.refreshToken !== "string") {
        return;
    }
    googleAPIHandler = new GoogleAPIHandler(payload.refreshToken);
    await googleAPIHandler.setToken();
}

async function doImport(payload: any) {
    try {
      if (typeof googleAPIHandler === "undefined") {
        return;
      }
        // logger.info(`Inside doImport. user: ${util.inspect(user, true, 3, true)}`);
        const { user, importDetails } = payload;

        const status = importDetails.status;
        if (["NEW", "FETCHING_THREADLISTS"].includes(status)) {
          let pageToken;
          if (status === "FETCHING_THREADLISTS") {
            const [error, pageToken] = await getPageToken(user)
            if (error) {
              logger.error(error);
            }
          }
          await fetchThreadList(googleAPIHandler, pageToken);
        }
        // switch (importDetails.status) {
        //     case "NEW":
        //         await fetchThreadList();
        //         break;
        //     case "FETCHING_THREADLISTS":
        //         break;
        //     case "FETCHING_THREADS":
        //         break;
        //     case "COMPLETED":
        //         break;
        //     default:
        //         break;
        // }
    } catch (error) {
        logger.error(error);
    }
}
