import mongoose from "mongoose";
import { logger } from "../utils/logger.js";

export const connectDB = async () => {
	try {
		const mongoUri = process.env.MONGODB_URI || process.env.MONGODB_URI;

		if (!mongoUri) {
			throw new Error("MONGODB_URI or MONGODB_URI is required");
		}

		const conn = await mongoose.connect(mongoUri);
		logger.info(`MongoDB Connected: ${conn.connection.host}`);
	} catch (err: any) {
		logger.error(`Error: ${err.message}`);
		process.exit(1);
	}
};
