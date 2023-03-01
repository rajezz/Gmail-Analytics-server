import dotenv from "dotenv";

const MONGODB_URI_LOCAL = "mongodb://localhost:27017/GmailAnalytics";

export const ENVIRONMENT = process.env.NODE_ENV;
const prod = ENVIRONMENT === "production"; // Anything else is treated as 'dev'

dotenv.config({ path: ".env" });

const SESSION_SECRET = process.env["SESSION_SECRET"];

const MONGODB_URI = prod ? process.env["MONGODB_URI"] : MONGODB_URI_LOCAL;

console.log(`Using MongoDB URI: ${MONGODB_URI}`);

if (!MONGODB_URI) {
  console.error("Mongo connection string not set. Set MONGODB_URI environment variable.");
  process.exit(1);
}

if (!SESSION_SECRET) {
    console.error("No client secret. Set SESSION_SECRET environment variable.");
    process.exit(1);
}

export const mongoUrl = MONGODB_URI;

export const sessionSecret = SESSION_SECRET;

