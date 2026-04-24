import llmClient from "./llmClient.js";

const MODEL = process.env.MODEL as string;

export async function summarizeResults(
	question: string,
	results: Record<string, unknown>[]
): Promise<string> {
	const response = await llmClient.chat.completions.create({
		model: MODEL,
		messages: [
			{
				role: "system",
				content:
					"Summarize gym database query results in 1-2 direct sentences for a gym owner. No fluff."
			},
			{
				role: "user",
				content: `Question: ${question}\nResults: ${JSON.stringify(results)}`
			}
		]
	});

	return response.choices[0].message.content?.trim() ?? "";
}
