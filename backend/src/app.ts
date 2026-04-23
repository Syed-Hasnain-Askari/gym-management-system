import express from "express";
import cors from "cors";
import memberRoutes from "./routes/member.route.js";
import feesRoutes from "./routes/fees.route.js";
import dashboardRoutes from "./routes/dashboard.route.js";
import membershipRoutes from "./routes/membership.route.js";
import authRoutes from "./routes/auth.route.js";
import nlQueryRoutes from "./routes/nlQuery.route.js";
import { errorHandler } from "./middleware/error.js";

import dotenv from "dotenv";
dotenv.config();


const app = express();

app.use(express.json());
app.use(cors()); // Enable CORS

app.use("/api/auth", authRoutes);
app.use("/api", memberRoutes);
app.use("/api", feesRoutes);
app.use("/api", dashboardRoutes);
app.use("/api", membershipRoutes);
app.use("/api", nlQueryRoutes);

// Error handling middleware
app.use(errorHandler);

export default app;
