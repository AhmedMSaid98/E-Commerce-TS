import winston from "winston";
import fs from "fs";
import path, { format } from "path";
import "dotenv/config";

const logsDir = path.join(process.cwd(), String(process.env.LOG_DIRECTORY));
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
}

const logger = winston.createLogger({
    level: process.env.LOG_LEVEL === "production" ? "info" : "debug",
    format: winston.format.combine(
        winston.format.timestamp({ format: String(process.env.LOG_DATE_PATTERN) }),
        winston.format.errors({ stack: true }),
        winston.format.json(),
        winston.format.prettyPrint()
    ),
    defaultMeta: { service: String(process.env.SERVICE_LAYER) },
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.timestamp({ format: "HH:mm:ss" }),
                winston.format.printf(({ timestamp, level, message, ...meta }: any) => {
                    let msg = `${timestamp} [${level}]: ${message}`;
                    if (Object.keys(meta).length > 0) {
                        msg += ` ${JSON.stringify(meta)}`;
                    }
                    return msg;
                })
            ),
        }),
        new winston.transports.File({
            filename: path.join(logsDir, "error.log"),
            level: "error",
            maxFiles: Number(process.env.LOG_MAX_FILES),
            maxsize: Number(process.env.LOG_MAX_FILE_SIZE),
        }),
        new winston.transports.File({
            filename: path.join(logsDir, "combined.log"),
            maxFiles: Number(process.env.LOG_MAX_FILES),
            maxsize: Number(process.env.LOG_MAX_FILE_SIZE),
        }),
    ],
});

export default logger;
