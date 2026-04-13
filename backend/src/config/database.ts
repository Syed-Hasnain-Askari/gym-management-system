import mongoose from "mongoose";
import { logger } from "../utils/logger.js";

const connectDB = async () => {
	try {
		const conn = await mongoose.connect(process.env.MONGO_URI as string);
		logger.info(`MongoDB Connected: ${conn.connection.host}`);
	} catch (err: any) {
		logger.error(`Error: ${err.message}`);
		process.exit(1);
	}
};

export default connectDB;
