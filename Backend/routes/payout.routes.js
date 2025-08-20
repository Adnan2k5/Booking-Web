import express from "express";
import {
  createBatchPayout,
  getBatchPayouts,
  getUserPayouts,
  linkPayPalAccount,
  paypalCallback,
} from "../controllers/payout.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/batch", verifyJWT, createBatchPayout);
router.get("/batch/:batchId", verifyJWT, getBatchPayouts);
router.get("/user/:userId", verifyJWT, getUserPayouts);

router.get("/connect", verifyJWT, linkPayPalAccount);
router.get("/callback", paypalCallback);

export default router;
