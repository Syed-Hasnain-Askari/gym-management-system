import geminiClient from "./geminiClient.js";
import { discoverCollections, buildSchemaContext } from "./schemaDiscovery.service.js";

const MODEL = "openai/gpt-oss-120b";

async function buildSystemPrompt(): Promise<string> {
  // Dynamically fetch schema every request
  const schemas = await discoverCollections();
  const schemaContext = buildSchemaContext(schemas);
  const collectionNames = schemas.map((s) => `"${s.name}"`).join(" | ");

  return `
You are a MongoDB query generator for a gym management system.

Below are the REAL collections currently in the database with their actual fields and sample data:

${schemaContext}

Rules:
- Analyze the user's question and pick the MOST relevant collection from the list above.
- Return ONLY a raw JSON object. No markdown, no backticks, no explanation.
- Today's date is: ${new Date().toISOString()}
- Never invent field names. Only use fields that exist in the schema above.

Required response format:
{
  "collection": ${collectionNames},
  "filter": {},
  "projection": {}
}
  `.trim();
}

export async function generateMongoQuery(userQuestion: string) {
  const systemPrompt = await buildSystemPrompt();

  const response = await geminiClient.chat.completions.create({
    model: MODEL,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userQuestion }
    ]
  });

  const raw = response.choices[0].message.content?.trim() ?? "";
  const cleaned = raw.replace(/```json|```/g, "").trim();

  return JSON.parse(cleaned);
}

export async function summarizeResults(
  question: string,
  results: Record<string, unknown>[]
): Promise<string> {
  const response = await geminiClient.chat.completions.create({
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