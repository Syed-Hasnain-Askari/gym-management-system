import app from "./app.js";
import config from "./config/index.js";
import { logger } from "./utils/logger.js";
import connectDB from "./config/database.js";

const PORT = config.port;

let server: any;

const startServer = async () => {
	// Connect to database
	await connectDB();

	server = app.listen(PORT, () => {
		logger.info(`Server running on port ${PORT}`);
	});

	return server;
};

startServer().catch((err: Error) => {
	logger.error(`Failed to start server: ${err.message}`);
	process.exit(1);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err: any) => {
	logger.error(`Error: ${err.message}`);
	if (server) {
		server.close(() => process.exit(1));
	} else {
		process.exit(1);
	}
});
