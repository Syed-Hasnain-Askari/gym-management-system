import { answerGeneralQuestion } from "../ai/generalQuestionResponder.js";
import { classifyIntent } from "../ai/intentClassifier.js";
import { generateMongoQuery } from "../ai/mongoQueryGenerator.js";
import { summarizeResults } from "../ai/resultSummarizer.js";
import { executeQuery } from "../data/queryExecutor.js";
import type { IntentType } from "../ai/intentClassifier.js";

export interface QueryResponsePayload {
	intent: IntentType;
	success: boolean;
	question: string;
	summary: string;
	totalResults: number;
	results: unknown[];
	query?: unknown;
}

export async function handleQuestion(
	question: string
): Promise<QueryResponsePayload> {
	const intent = await classifyIntent(question);

	if (intent === "destructive_operation") {
		return {
			intent,
			success: true,
			question,
			summary:
				"I'm read-only and cannot delete, update, or insert data. I can only help you view and query your gym data.",
			totalResults: 0,
			results: []
		};
	}

	if (intent === "general_question") {
		const answer = await answerGeneralQuestion(question);
		return {
			intent,
			success: true,
			question,
			summary: answer,
			totalResults: 0,
			results: []
		};
	}

	const parsedQuery = await generateMongoQuery(question);
	const results = await executeQuery(parsedQuery);
	const summary = await summarizeResults(question, results);

	return {
		intent,
		success: true,
		question,
		summary,
		totalResults: results.length,
		results,
		query: parsedQuery
	};
}
