import express from "express";
import { getInsights } from "../controller/insight.js";

const router = express.Router();

router.get("/insights", getInsights);

export default router;
