import express from "express";
import bodyParser from "body-parser";
import compression from "compression";
import cors from "cors";
import lusca from "lusca";
import MongoStore from "connect-mongo";
import passport from "passport";
import session from "express-session";
import mongoose from "mongoose";

import { MONGODB_URI, SESSION_SECRET } from "./lib/secret";

import { apiRouter } from "./routes/api";

// Create expresss server...
const app = express();

// Connect to MongoDB...

import "./config/passport";
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB!");
  })
  .catch((err) => {
    console.error("Error occurred while connecting to MongoDB: ", err);
  });

app.use(compression());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.set("port", process.env.PORT || 3000);
app.use(
  session({
    resave: true,
    saveUninitialized: true,
    secret: SESSION_SECRET,
    store: new MongoStore({
      mongoUrl: MONGODB_URI,
    }),
  })
);

// Initialize passport configuration
app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(lusca.xframe("SAMEORIGIN"));
app.use(lusca.xssProtection(true));

app.use("/api", apiRouter);

export default app;
