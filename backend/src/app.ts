import express from "express";
import logger from "./utils/logger.js";
import cors from "cors";
import memberRoutes from "./routes/member.route.js";
import feesRoutes from "./routes/fees.route.js";
import dashboardRoutes from "./routes/dashboard.route.js";

const app = express();

app.use(express.json());
app.use(cors()); // Enable CORS

// Log incoming requests
app.use((req: express.Request, res: express.Response, next: any) => {
	logger.info(`Incoming Request: ${req.method} ${req.originalUrl}`);
	next();
});

app.use("/api", memberRoutes);
app.use("/api", feesRoutes);
app.use("/api", dashboardRoutes);

export default app;
