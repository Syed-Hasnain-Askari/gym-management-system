import express from "express";
import cors from "cors";
import memberRoutes from "./routes/member.route.js";
import feesRoutes from "./routes/fees.route.js";
import dashboardRoutes from "./routes/dashboard.route.js";
import authRoutes from "./routes/auth.route.js";
import { errorHandler } from "./middleware/error.js";

const app = express();

app.use(express.json());
app.use(cors()); // Enable CORS

app.use("/api/auth", authRoutes);
app.use("/api", memberRoutes);
app.use("/api", feesRoutes);
app.use("/api", dashboardRoutes);

// Error handling middleware
app.use(errorHandler);

export default app;
