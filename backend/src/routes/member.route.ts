import express from "express";
import {
	getMembers,
	addMembers,
	editMember,
	deleteMember,
	getMemberById
} from "../controller/member.js";

const router = express.Router();

router.get("/members", getMembers);
router.get("/members/:id", getMemberById);
router.post("/members", addMembers);
router.patch("/members/:id", editMember);
router.delete("/members/:id", deleteMember);

export default router;
