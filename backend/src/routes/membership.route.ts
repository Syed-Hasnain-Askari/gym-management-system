import express from "express";
import { purchaseMembership } from "../controller/membership.js";

const router = express.Router();

router.post("/membership", purchaseMembership);

export default router;
