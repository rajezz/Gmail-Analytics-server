import { createLogger, transports, format } from "winston";
import "winston-daily-rotate-file";

const defaultFormat = format.combine(
  format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  format.errors({ stack: true })
);

const logger = createLogger({
  format: format.combine(defaultFormat, format.splat(), format.json()),
  transports: [
    new transports.DailyRotateFile({
      filename: (process.env.FILE_NAME || "out.log").replace(".log", "-%DATE%.log"),
      datePattern: "YYYY-MM-DD",
      zippedArchive: false,
      level: "silly",
      format: format.combine(
        defaultFormat,
        format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`)
      ),
    }),
    new transports.Console({
      format: format.combine(
        defaultFormat,
        format.colorize(),
        format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`)
      ),
      level: "silly",
    })
  ],
});

export default logger;
