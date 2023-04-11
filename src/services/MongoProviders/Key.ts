import { FilterQuery } from "mongoose";
import { asyncWrapper } from "../../lib/utils";
import { Key, KeyDocument } from "../../models/Key";

export const upsertKeyDoc = async (doc: KeyDocument) => {
    return await asyncWrapper(
        Key.findOneAndUpdate({ googleId: doc.googleId }, doc, {
            upsert: true,
        })
    );
};

export const createKeyDoc = async (doc: KeyDocument) => {
    return await asyncWrapper(
        Key.create(doc)
    );
};


export const findKeyDocById = async (id: string) => {
    return await asyncWrapper(Key.findOne({ _id: id }));
};
export const findKeyDoc = async (query: FilterQuery<KeyDocument>) => {
    return await asyncWrapper(Key.findOne(query));
};
