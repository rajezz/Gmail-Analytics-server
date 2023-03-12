import { FilterQuery } from "mongoose";
import { asyncWrapper } from "../lib/utils";
import { User } from "../models/User";
import { UserDocument } from "../types/user";

export const upsertUserDoc = async (user: UserDocument) => {
    return await asyncWrapper(
        User.findOneAndUpdate({ googleId: user.googleId }, user, {
            upsert: true,
        })
    );
};
export const findUserDocById = async (id: string) => {
    return await asyncWrapper(User.findOne({ _id: id }));
};
export const findUserDoc = async (query: FilterQuery<UserDocument>) => {
    return await asyncWrapper(User.findOne(query));
};
