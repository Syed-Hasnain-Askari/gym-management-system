import type { NextFunction, Request, Response } from "express";
import { generateInsights } from "../services/insightService.js";
import { logger } from "../utils/logger.js";

type InsightCache = {
	data: Awaited<ReturnType<typeof generateInsights>>;
	expiry: number;
};

let insightCache: InsightCache | null = null;

const CACHE_TTL = 10 * 60 * 1000;

export const getInsights = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> => {
	try {
		const now = Date.now();

		if (insightCache && now < insightCache.expiry) {
			logger.info("Serving insights from cache");
			res.status(200).json({ success: true, insights: insightCache.data });
			return;
		}

		const insights = await generateInsights();
		insightCache = { data: insights, expiry: now + CACHE_TTL };

		res.status(200).json({ success: true, insights });
	} catch (error) {
		logger.error("Failed to fetch insights", { error });
		next(error);
	}
};
