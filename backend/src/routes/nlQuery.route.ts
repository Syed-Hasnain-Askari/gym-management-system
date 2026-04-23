import express from "express";
import { query } from "../controller/query.js";

const router = express.Router();

router.post("/nlQuery", query);

export default router;