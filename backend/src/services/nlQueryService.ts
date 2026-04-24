import geminiClient from "./geminiClient.js";
import { discoverCollections, buildSchemaContext } from "./schemaDiscovery.service.js";

const MODEL = process.env.MODEL as string;

type IntentType = "read_query" | "general_question" | "destructive_operation";

export async function classifyIntent(question: string): Promise<IntentType> {
  const response = await geminiClient.chat.completions.create({
    model: MODEL,
    messages: [
      {
        role: "system",
        content: `
You classify user questions for a gym management system.

Return ONLY one of these exact strings — nothing else:
- "read_query" → user wants to fetch or view data
- "general_question" → user is asking something conversational or general
- "destructive_operation" → user wants to delete, update, insert, or modify data

Examples:
"show all unpaid fees" → read_query
"how many members joined this month?" → read_query
"can you delete all members?" → destructive_operation
"what happens if I remove a member?" → general_question
"is it possible to delete records?" → general_question
"hello, what can you do?" → general_question
        `.trim()
      },
      { role: "user", content: question }
    ]
  });

  const result = response.choices[0].message.content?.trim().replace(/"/g, "") ?? "";

  if (["read_query", "general_question", "destructive_operation"].includes(result)) {
    return result as IntentType;
  }

  return "general_question"; // safe fallback
}

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

export async function generateMongoQuery(userQuestion: string) {
  const systemPrompt = await buildSystemPrompt();

  const response = await geminiClient.chat.completions.create({
    model: MODEL as string,
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
    model: process.env.MODEL as string,
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
export async function answerGeneralQuestion(question: string): Promise<string> {
  const response = await geminiClient.chat.completions.create({
    model: MODEL,
    messages: [
      {
        role: "system",
        content: `
You are a helpful assistant for a gym management system.
Answer the user's general question conversationally in 1-3 sentences.
You are read-only — you cannot delete, update, or insert any data.
If asked about destructive operations, explain politely that you don't have that capability.
        `.trim()
      },
      { role: "user", content: question }
    ]
  });

  return response.choices[0].message.content?.trim() ?? "I couldn't answer that. Please try again.";
}