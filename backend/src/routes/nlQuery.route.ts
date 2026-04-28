import express from "express";
import { query } from "../controller/query.js";
import { aiLimiter } from "../middleware/rateLimit.middleware.js";

const router = express.Router();

router.post("/nlQuery", aiLimiter, query);

export default router;
