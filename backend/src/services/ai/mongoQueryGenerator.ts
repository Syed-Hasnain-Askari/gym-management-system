import llmClient from "./llmClient.js";
import {
	buildSchemaContext,
	discoverCollections
} from "../data/schemaDiscovery.js";

const MODEL = process.env.MODEL as string;

export interface MongoQueryPayload {
	collection: string;
	filter: Record<string, unknown>;
	projection: Record<string, unknown>;
}

async function buildSystemPrompt(): Promise<string> {
	const schemas = await discoverCollections();
	const schemaContext = buildSchemaContext(schemas);
	const collectionNames = schemas.map((schema) => `"${schema.name}"`).join(" | ");

	return `
You are a MongoDB query generator for a gym management system.

Below are the REAL collections currently in the database with their actual fields and sample data:

${schemaContext}

Rules:
- You are READ-ONLY. Never generate queries that delete, update, insert, or modify data.
- If the user asks for a destructive operation, respond with exactly: {"error": "read_only"}
- Analyze the user's question and pick the MOST relevant collection from the list above.
- Return ONLY a raw JSON object. No markdown, no backticks, no explanation.
- Today's date is: ${new Date().toISOString()}
- Never invent field names. Only use fields that exist in the schema above.
- Never use destructive operations or keys such as: deleteMany, drop, updateMany, or $where.
- Never return an unbounded query; "filter" must always include meaningful constraints.

Required response format:
{
  "collection": ${collectionNames},
  "filter": {},
  "projection": {}
}
	`.trim();
}

export async function generateMongoQuery(
	userQuestion: string
): Promise<MongoQueryPayload> {
	const systemPrompt = await buildSystemPrompt();

	const response = await llmClient.chat.completions.create({
		model: MODEL,
		messages: [
			{ role: "system", content: systemPrompt },
			{ role: "user", content: userQuestion }
		]
	});

	const raw = response.choices[0].message.content?.trim() ?? "";
	const cleaned = raw.replace(/```json|```/g, "").trim();

	return JSON.parse(cleaned) as MongoQueryPayload;
}
