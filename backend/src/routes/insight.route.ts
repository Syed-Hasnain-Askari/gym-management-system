import express from "express";
import { insightLimiter } from "../middleware/rateLimit.middleware.js";
import { getInsights } from "../controller/insight.js";

const router = express.Router();

router.get("/insights", insightLimiter, getInsights);

export default router;
