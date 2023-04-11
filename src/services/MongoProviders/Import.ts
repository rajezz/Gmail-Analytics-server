import util from "util";
import logger from "../../lib/logger";
import { asyncWrapper } from "../../lib/utils";
import { Import } from "../../models/Import";

export async function incrementEmailCount(property: string, googleId: string, increment: number) {
    const [error, result] = await asyncWrapper(
        Import.updateOne({ googleId: googleId }, { $inc: { [property]: increment } })
    );
    if (error) {
        logger.error(
            `EmailList: Error while incrementing ${property} > ${util.inspect(error, true, 3)}`
        );
        return false;
    }
    logger.debug(
        `EmailList: Successfully incremented ${property} > ${util.inspect(result, true, 3)}`
    );
    return true;
}
