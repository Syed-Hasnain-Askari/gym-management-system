// logger.js
import { createLogger, format, transports } from "winston";

export const logger = createLogger({
	level: process.env.LOG_LEVEL || "info", // control via env, not hardcode
	format: format.combine(
		format.timestamp(),
		format.errors({ stack: true }), // critical — logs stack traces
		format.json() // structured, not pretty-printed garbage
	),
	transports: [
		new transports.Console(),
		new transports.File({ filename: "logs/error.log", level: "error" }),
		new transports.File({ filename: "logs/combined.log" })
	]
});

// Dev override — human-readable only in development
if (process.env.NODE_ENV !== "production") {
	logger.add(
		new transports.Console({
			format: format.combine(format.colorize(), format.simple())
		})
	);
}
