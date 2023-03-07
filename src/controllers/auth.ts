import logger from "../lib/logger";
import { NextFunction, Request, Response } from "express";
import passport from "passport";

const SCOPE_PREFERENCES = {
  all: ["https://mail.google.com/"],
  restricted: ["https://www.googleapis.com/auth/gmail.readonly"],
};

/**
 * API Route: GET /api/google/login
 * @export
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 * @return {*} 
 */
export function loginWithGoogleSSO(req: Request, res: Response, next: NextFunction) {
  const scopePref = req.params?.scopePref || "all";
  logger.debug("scopePref: " + scopePref);
  return passport.authenticate("google", { scope: ["profile", "email", ...SCOPE_PREFERENCES[scopePref]] })(
    req,
    res,
    next
  );
}
