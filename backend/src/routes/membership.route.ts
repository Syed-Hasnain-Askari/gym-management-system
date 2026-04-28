import express from "express";
import {
	getMemberships,
	purchaseMembership,
	updateMembership
} from "../controller/membership.js";
import { generalLimiter } from "../middleware/rateLimit.middleware.js";

const router = express.Router();

router.get("/membership", generalLimiter, getMemberships);
router.post("/membership", generalLimiter, purchaseMembership);
router.patch("/membership/:memberId", generalLimiter, updateMembership);

export default router;
