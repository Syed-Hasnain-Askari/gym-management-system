import express from "express";
import { getDashboardStats } from "../controller/dashboard.js";
import { insightLimiter } from "../middleware/rateLimit.middleware.js";

const router = express.Router();
router.get("/dashboard/stats", insightLimiter, getDashboardStats);

export default router;
