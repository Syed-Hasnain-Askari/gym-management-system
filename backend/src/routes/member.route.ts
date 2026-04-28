import express from "express";
import {
	getMembers,
	addMembers,
	editMember,
	deleteMember,
	getMemberById
} from "../controller/member.js";
import { generalLimiter } from "../middleware/rateLimit.middleware.js";

const router = express.Router();

router.get("/members", generalLimiter, getMembers);
router.get("/members/:id", generalLimiter, getMemberById);
router.post("/members", generalLimiter, addMembers);
router.patch("/members/:id", generalLimiter, editMember);
router.delete("/members/:id", generalLimiter, deleteMember);

export default router;
