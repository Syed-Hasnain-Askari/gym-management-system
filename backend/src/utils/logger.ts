// logger.js
import { createLogger, format, transports } from "winston";

export const logger = createLogger({
	level: "info",
	format: format.combine(format.timestamp(), format.json()),
	transports: [
		new transports.Console(),
		new transports.File({ filename: "error.log", level: "error" }),
		new transports.File({ filename: "combined.log" })
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
