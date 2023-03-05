import { createLogger, transports } from "winston";

const logger = createLogger({
  transports: [
    new transports.Console({
      level: process.env.LOG_LEVEL || "info",
    }),
    new transports.File({
        filename: "out.log",
        level: "debug"
    }),
  ],
});



export default logger