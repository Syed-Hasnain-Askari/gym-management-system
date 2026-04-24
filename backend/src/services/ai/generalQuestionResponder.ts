import llmClient from "./llmClient.js";

const MODEL = process.env.MODEL as string;

export async function answerGeneralQuestion(question: string): Promise<string> {
	const response = await llmClient.chat.completions.create({
		model: MODEL,
		messages: [
			{
				role: "system",
				content: `
You are a helpful assistant for a gym management system.
Answer the user's general question conversationally in 1-3 sentences.
You are read-only - you cannot delete, update, or insert any data.
If asked about destructive operations, explain politely that you don't have that capability.
				`.trim()
			},
			{ role: "user", content: question }
		]
	});

	return (
		response.choices[0].message.content?.trim() ??
		"I couldn't answer that. Please try again."
	);
}
