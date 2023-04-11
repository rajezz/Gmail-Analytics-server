import { FilterQuery, Model, UpdateQuery } from "mongoose";
import util from "util";

import MongoError from "../../lib/MongoError";
import logger from "../../lib/logger";
import { asyncWrapper } from "../../lib/utils";

const NotFoundError = {
    name: "NotFoundError",
    message: "Document not found",
    stack: "",
};

export async function findById<T>(model: Model<T>, id: string) {
    const [error, response] = await asyncWrapper(model.findOne({ _id: id }));
    if (error) {
        logger.error(`Error: ${util.inspect(error, true, 3)}`);
        return [new MongoError(error)];
    }
    if (response == null) {
        return [new MongoError(NotFoundError)];
    }
    logger.info(`Response: ${util.inspect(response, true, 3)}`);
    return [null, response];
}

export async function findByQuery<T>(
    model: Model<T>,
    query: FilterQuery<T>,
    sort: any = undefined
) {
    const [error, response] = await asyncWrapper(model.findOne(query).sort(sort));
    if (error) {
        logger.error(`Error: ${util.inspect(error, true, 3)}`);
        return [new MongoError(error)];
    }
    if (response == null) {
        return [new MongoError(NotFoundError)];
    }
    logger.info(`Response: ${util.inspect(response, true, 3)}`);
    return [null, response];
}

export async function updateOrUpsert<T>(
    model: Model<T>,
    query: FilterQuery<T>,
    doc: UpdateQuery<T>
) {
    const [error, response] = await asyncWrapper(
        model.findOneAndUpdate(query, doc, { upsert: true })
    );
    logger.error(`Error: ${util.inspect(error, true, 3)}`);
    if (error || response == null) {
        return [new MongoError(error)];
    }
    logger.info(`Response: ${util.inspect(response, true, 3)}`);
    return [null, response];
}
export async function createDoc<T>(model: Model<T>, doc: T) {
    const [error, response] = await asyncWrapper(model.create(doc));

    logger.error(`Error: ${util.inspect(error, true, 3)}`);
    if (error || response == null) {
        return [new MongoError(error)];
    }

    logger.info(`Response: ${util.inspect(response, true, 3)}`);
    return [null, response];
}
