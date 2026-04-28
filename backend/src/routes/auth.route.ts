import express from "express";
import { githubLogin, githubCallback } from "../controller/auth.js";
import { generalLimiter } from "../middleware/rateLimit.middleware.js";

const router = express.Router();

router.get("/github", generalLimiter, githubLogin);
router.get("/github/callback", generalLimiter, githubCallback);

export default router;
