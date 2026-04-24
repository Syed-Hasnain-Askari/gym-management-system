import llmClient from "./llmClient.js";

const MODEL = process.env.MODEL as string;

export type IntentType =
	| "read_query"
	| "general_question"
	| "destructive_operation";

export async function classifyIntent(question: string): Promise<IntentType> {
	const response = await llmClient.chat.completions.create({
		model: MODEL,
		messages: [
			{
				role: "system",
				content: `
You classify user questions for a gym management system.

Return ONLY one of these exact strings - nothing else:
- "read_query" -> user wants to fetch or view data
- "general_question" -> user is asking something conversational or general
- "destructive_operation" -> user wants to delete, update, insert, or modify data

Examples:
"show all unpaid fees" -> read_query
"how many members joined this month?" -> read_query
"can you delete all members?" -> destructive_operation
"what happens if I remove a member?" -> general_question
"is it possible to delete records?" -> general_question
"hello, what can you do?" -> general_question
				`.trim()
			},
			{ role: "user", content: question }
		]
	});

	const result =
		response.choices[0].message.content?.trim().replace(/"/g, "") ?? "";

	if (
		["read_query", "general_question", "destructive_operation"].includes(
			result
		)
	) {
		return result as IntentType;
	}

	return "general_question";
}
