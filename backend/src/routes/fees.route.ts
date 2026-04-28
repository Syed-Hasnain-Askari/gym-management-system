import express from "express";
import {
	getFeesByUserId,
	addFeesByUserId,
	updateFeesByUserId
} from "../controller/fees.js";
import { generalLimiter } from "../middleware/rateLimit.middleware.js";
const router = express.Router();
router.get("/fees/:userId", generalLimiter, getFeesByUserId);
router.post("/fees/:userId", generalLimiter, addFeesByUserId);
router.patch("/fees/:userId", generalLimiter, updateFeesByUserId);

export default router;
