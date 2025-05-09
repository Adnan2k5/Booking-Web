import express from "express";
import {
  createSession,
  updateSession,
  deleteSession,
  getAllSessions,
  createPreset,
  getInstructorSessions,
} from "../controllers/session.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/instructors", getInstructorSessions);
// Create a session
router.post("/preset", verifyJWT, createPreset);
router.post("/", verifyJWT, createSession);
router.get("/:id", verifyJWT, getAllSessions);

// Update a session
router.put("/:id", verifyJWT, updateSession);

// Delete a session
router.delete("/:id", verifyJWT, deleteSession);

export default router;
