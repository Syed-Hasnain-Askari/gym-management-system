import { logger } from "../utils/logger.js";
import { Request, Response, NextFunction } from "express";
export const errorHandler = (
	err: any,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	let statusCode = err.statusCode || 500;
	let message = err.message || "Internal Server Error";

	// Add debug logging for err.message
	logger.info(
		`Debug: err.message type: ${typeof err.message}, content: ${err.message}`
	);

	logger.error(
		`Error: ${message}, StatusCode: ${statusCode}, Path: ${req.path}, Method: ${req.method}, IP: ${req.ip}`
	);

	res.status(statusCode).json({
		status: "error",
		statusCode,
		message
	});
};
