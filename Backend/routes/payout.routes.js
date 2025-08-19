import express from "express";
import { createBatchPayout, getBatchPayouts, getUserPayouts } from "../controllers/payout.controller.js";
import { authMiddleware, adminMiddleware } from "../middlewares/auth.js";

const router = express.Router();

router.post("/batch", authMiddleware, adminMiddleware, createBatchPayout);

router.get("/batch/:batchId", authMiddleware, adminMiddleware, getBatchPayouts);

router.get("/user/:userId", authMiddleware, getUserPayouts);

export default router;
