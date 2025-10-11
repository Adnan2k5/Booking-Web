import express from "express";
import {
  createRule,
  updateRule,
  deleteRule,
  listRules,
  evaluateMyAchievements,
} from "../controllers/achievementRule.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { verifyAdmin } from "../middlewares/admin.middleware.js";

const router = express.Router();

// Admin endpoints
router.post("/", verifyJWT, verifyAdmin, createRule);
router.put("/:id", verifyJWT, verifyAdmin, updateRule);
router.delete("/:id", verifyJWT, verifyAdmin, deleteRule);

// Public/admin list
router.get("/", verifyJWT, listRules);

// Evaluate my achievements now
router.post("/evaluate", verifyJWT, evaluateMyAchievements);

export default router;
