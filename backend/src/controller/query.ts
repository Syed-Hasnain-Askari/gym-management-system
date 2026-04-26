import type { NextFunction, Request, Response } from "express";
import { handleQuestion } from "../services/query/queryOrchestrator.js";
import { logger } from "../utils/logger.js";

export const query = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void | Response> => {
	try {
		const { question } = req.body as { question: string };

		if (!question || question.trim() === "") {
			return res.status(400).json({ error: "Question is required." });
		}

		const payload = await handleQuestion(question);
		const { intent, ...responseBody } = payload;
		logger.info("Intent classified", { intent, question });
		return res.status(200).json(responseBody);
	} catch (err) {
		next(err);
	}
};
