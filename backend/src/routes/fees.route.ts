import express from "express";
import {
	getFeesByUserId,
	addFeesByUserId,
	updateFeesByUserId
} from "../controller/fees.js";

const router = express.Router();
router.get("/fees/:userId", getFeesByUserId);
router.post("/fees/:userId", addFeesByUserId);
router.patch("/fees/:userId", updateFeesByUserId);

export default router;
