import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
	throw new Error("OPENAI_API_KEY is not set in environment variables.");
}

const llmClient = new OpenAI({
	apiKey,
	baseURL: process.env.GROQ_BASE_URL
});

export default llmClient;
