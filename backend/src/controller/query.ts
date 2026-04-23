import { logger } from "../utils/logger.js";
import type { Request, Response, NextFunction } from "express";
import { generateMongoQuery, summarizeResults } from "../services/nlQueryService.js";
import { executeQuery } from "../services/queryExecutor.js";

export const query = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { question } = req.body as { question: string };
    if (!question || question.trim() === "") {
      res.status(400).json({ error: "Question is required." });
      return;
    }

    const parsedQuery = await generateMongoQuery(question);
    logger.info(parsedQuery, "parsedQuery");

    const results = await executeQuery(parsedQuery);
    logger.info(results, "results");

    const summary = await summarizeResults(question, results);
    logger.info(summary, "summary");

    res.status(200).json({
      success: true,
      question,
      summary,
      totalResults: results.length,
      results,
      query: parsedQuery
    });

  } catch (err) {
    logger.error(err);
    next(err);
  }
};