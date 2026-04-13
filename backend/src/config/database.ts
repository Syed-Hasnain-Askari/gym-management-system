import mongoose from "mongoose";
import winstonLogger from "../utils/logger";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    winstonLogger.info(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err:any) {
    winstonLogger.error(`Error: ${err.message}`);
    process.exit(1);
  }
};

export default connectDB;