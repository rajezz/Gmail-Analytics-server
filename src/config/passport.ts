import { Request } from "express";
import passport from "passport";
import {
    Strategy as GoogleStrategy,
    GoogleCallbackParameters,
    Profile,
    VerifyCallback,
} from "passport-google-oauth20";
import { GOOGLE_CALLBACK_URL } from "../_data/urls";

import util from "util";

import { User } from "../models/User";
import logger from "../lib/logger";
import { UserDocument } from "../types/user";
import { findUserDocById, upsertUserDoc } from "../services/UserProvider";

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
        logger.debug(`Received params: ${util.inspect(params, false, 3, true)}`);
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

        const [error, response] = await upsertUserDoc(currentUser);
        if (error) {
            logger.error(
                `Couldn't update user document. Error: ${util.inspect(error, false, 3, true)}`
            );
            return;
        }
        logger.debug(
            `user document Added/Updated. User: ${util.inspect(response, false, 3, true)}`
        );
        if (response) return done(null, response);
    } catch (error) {
        logger.error(error);
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
    logger.debug(`Serializing user: ${util.inspect(user, false, 3, true)}`);
    callback(null, user._id);
});

passport.deserializeUser(async (id, callback) => {
    const [error, user] = await findUserDocById(id as string);

    if (error) {
        logger.error(`Error while serializing user: ${util.inspect(error, false, 3, true)}`);
        callback(error, null);
    }

    logger.debug(`DeSerialized user: ${util.inspect(user, false, 3, true)}`);
    if (user) callback(null, user);
});
