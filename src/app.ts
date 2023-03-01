import express from "express";
import bodyParser from "body-parser";
import compression from "compression";
import cors from "cors";
import lusca from "lusca";
import MongoStore from "connect-mongo";
import passport from "passport";
import session from "express-session";
import mongoose from "mongoose";

import { mongoUrl, sessionSecret } from "./lib/secret";
import { rootRouter } from "./routes";

// Create expresss server...
const app = express();

// Connect to MongoDB...

mongoose
  .connect(mongoUrl)
  .then(() => {
    console.log("Connected to MongoDB!");
  })
  .catch((err) => {
    console.error("Error occurred while connecting to MongoDB: ", err);
  });

app.use(compression());
app.use(cors());
app.set("port", process.env.PORT || 3000);
app.use(
  session({
    resave: true,
    saveUninitialized: true,
    secret: sessionSecret,
    store: new MongoStore({
      mongoUrl,
    }),
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(lusca.xframe("SAMEORIGIN"));
app.use(lusca.xssProtection(true));

app.use(rootRouter);

export default app;
