import { logger } from "../utils/logger.js";
import type { Request, Response, NextFunction } from "express";
import {
  classifyIntent,
  generateMongoQuery,
  summarizeResults,
  answerGeneralQuestion
} from "../services/nlQueryService.js";
import { executeQuery } from "../services/queryExecutor.js";

export const query = async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
   try {
    const { question } = req.body as { question: string };

    if (!question || question.trim() === "") {
      return res.status(400).json({ error: "Question is required." });
    }

    // Step 1 — classify intent
    const intent = await classifyIntent(question);
    logger.info({ intent, question }, "Intent classified");

    // Step 2 — route based on intent
    if (intent === "destructive_operation") {
      return res.status(200).json({
        success: true,
        question,
        summary: "I'm read-only and cannot delete, update, or insert data. I can only help you view and query your gym data.",
        totalResults: 0,
        results: []
      });
    }

    if (intent === "general_question") {
      const answer = await answerGeneralQuestion(question);
      return res.status(200).json({
        success: true,
        question,
        summary: answer,
        totalResults: 0,
        results: []
      });
    }

    // intent === "read_query"
    const parsedQuery = await generateMongoQuery(question);
    const results = await executeQuery(parsedQuery);
    const summary = await summarizeResults(question, results);

    return res.status(200).json({
      success: true,
      question,
      summary,
      totalResults: results.length,
      results,
      query: parsedQuery
    });

  } catch (err) {
    next(err);
  }
};