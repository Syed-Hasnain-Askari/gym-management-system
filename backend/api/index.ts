import app from "../src/app.js";
import { connectDB } from "../src/config/database.js";
import { logger } from "../src/utils/logger.js";

let dbConnectionPromise: Promise<unknown> | null = null;

function ensureDatabaseConnection() {
	if (!dbConnectionPromise) {
		dbConnectionPromise = connectDB().catch((error) => {
			dbConnectionPromise = null;
			logger.error(`Failed to connect to MongoDB on Vercel: ${error.message}`);
			throw error;
		});
	}

	return dbConnectionPromise;
}

export default async function handler(req: any, res: any) {
	await ensureDatabaseConnection();
	return app(req, res);
}
