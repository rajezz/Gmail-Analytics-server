import { Request } from "express";
import passport from "passport";
import util from "util";
import {
    Strategy as GoogleStrategy,
    GoogleCallbackParameters,
    Profile,
    VerifyCallback,
} from "passport-google-oauth20";

import { GOOGLE_CALLBACK_URL } from "../_data/urls";
import logger from "../lib/logger";
import { User, UserDocument } from "../models/User";
import {
    createDoc,
    findById,
    findByQuery,
    updateOrUpsert,
} from "../services/MongoProviders/common";
import MongoError from "../lib/MongoError";
import { Import, ImportDocument } from "../models/Import";

async function googleStrategyCallback(
    req: Request,
    accessToken: string,
    refreshToken: string,
    params: GoogleCallbackParameters,
    profile: Profile,
    done: VerifyCallback
) {
    try {
        logger.info("googleStrategyCallback called");
        logger.debug(`Received profile object: ${util.inspect(profile, false, 3, true)}`);
        // logger.debug(`Received params: ${util.inspect(params, false, 3, true)}`);
        logger.debug(`Received refreshToken: ${refreshToken}`);

        if (!profile.emails?.[0]) {
            throw new Error("Google profile does not contain email address");
        }

        const scopePref = req.params?.scopePref || "all";

        const currentUser: UserDocument = {
            name: `${profile.name?.givenName} ${profile.name?.familyName}`,
            email: profile.emails?.[0].value,
            picture: profile.photos?.[0].value,
            googleId: profile.id,
            refreshToken,
            scopePref,
        };
        const query = { googleId: currentUser.googleId };

        const [userError, userResponse] = await updateOrUpsert<UserDocument>(
            User,
            query,
            currentUser
        );

        if (userError instanceof MongoError) {
            logger.error("Failed to update User document.");
            return done(userError.message);
        }

        const [fetchError, fetchResponse] = await findByQuery<ImportDocument>(Import, query);

        logger.info(`fetchError: ${util.inspect(fetchError, true, 3, true)}`);
        logger.info(`fetchResponse: ${util.inspect(fetchResponse, true, 3, true)}`);

        if (typeof fetchResponse !== "undefined") {
            return done(null, userResponse);
        }

        if (fetchError.name === "NotFoundError") {
            logger.info(
                `[${currentUser.googleId}] - Import details not found. Creating Import documnet...`
            );
            await createDoc<ImportDocument>(Import, query);
        }

        return done(null, userResponse);
    } catch (error) {
        logger.error(error);
        return done(<Error>error);
    }
}
const googleStrategy = new GoogleStrategy(
    {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: GOOGLE_CALLBACK_URL,
        passReqToCallback: true,
    },
    googleStrategyCallback
);

passport.use(googleStrategy);

passport.serializeUser((user: any, callback) => {
    logger.debug(`Serializing user: ${user.email}`);
    callback(null, user._id);
});

passport.deserializeUser(async (id, callback) => {
    const [error, user] = await findById<UserDocument>(User, <string>id);

    if (error instanceof MongoError) {
        callback(error.toObj(), null);
    }

    logger.debug(`DeSerialized user: ${user.email}`);
    if (user) callback(null, user);
});
