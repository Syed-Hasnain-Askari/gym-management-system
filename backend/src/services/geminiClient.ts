import dotenv from "dotenv";
dotenv.config();

import OpenAI from "openai";

const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
  throw new Error("OPENAI_API_KEY is not set in environment variables.");
}

const geminiClient = new OpenAI({
  apiKey:process.env.OPENAI_API_KEY,
  baseURL: process.env.GROQ_BASE_URL
});

export default geminiClient;
