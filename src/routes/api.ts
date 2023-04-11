import passport from "passport";
import util from "util";

import logger from "../lib/logger";
import { CLIENT_LOGIN_ERROR_URL, CLIENT_LOGIN_SUCCESS_URL } from "../_data/urls";
import { Router } from "express";

import { retrieveApiKey, sendUser, logoutUser } from "../controllers/user";
import { authenticateUser } from "../middlewares/auth";
import { loginWithGoogleSSO, getEmails } from "../controllers/google";
import { startImport } from "../controllers/import";

const apiRouter = Router();

apiRouter.get("/google/login", loginWithGoogleSSO);

apiRouter.get("/google/logout", logoutUser);
apiRouter.get("/google/emails", authenticateUser, getEmails);

// Import API endpoints...
apiRouter.get("/import/start", authenticateUser, startImport);

apiRouter.get(
    "/google/callback",
    passport.authenticate("google", {
        failureMessage: "Failed to authenticate with Google. Try again later!",
        failureRedirect: CLIENT_LOGIN_ERROR_URL,
        successRedirect: CLIENT_LOGIN_SUCCESS_URL,
    }),
    (req, res) => {
        logger.debug(`DeSerialized user: ${util.inspect(req.user, false, 3, true)}`);
        res.send("Successfully logged in with Google.");
    }
);

apiRouter.get("/user/authenticate", authenticateUser, sendUser);

apiRouter.get("/user/apikey", authenticateUser, retrieveApiKey);

export { apiRouter };
