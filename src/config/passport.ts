import { Request } from "express";
import passport from "passport";
import { Strategy as GoogleStrategy, GoogleCallbackParameters, Profile, VerifyCallback } from "passport-google-oauth20";
import { GOOGLE_CALLBACK_URL } from "../_data/urls";

import util from "util";

import { User } from "../models/User";
import logger from "../lib/logger";

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
    const currentUser = {
      fullName: `${profile.name?.givenName} ${profile.name?.familyName}`,
      email: profile.emails?.[0].value,
      picture: profile.photos?.[0].value,
      googleId: profile.id,
      refreshToken,
    };

    const user = await User.findOneAndUpdate({ googleId: currentUser.googleId }, currentUser, { upsert: true });

    logger.debug(`user document Added/Updated. User: ${util.inspect(user, false, 3, true)}`);
    if (user) return done(null, user);
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
  callback(null, user.id);
});

passport.deserializeUser(async (id, callback) => {
  const user = await User.findOne({ _id: id }).catch((error) => {
    logger.error(`Error while serializing user: ${util.inspect(error, false, 3, true)}`);
    callback(error, null);
  });

  logger.debug(`DeSerialized user: ${util.inspect(user, false, 3, true)}`);
  if (user) callback(null, user);
});
