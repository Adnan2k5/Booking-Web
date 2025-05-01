import express from "express";
import { createSession, updateSession, deleteSession } from "../controllers/session.controller.js";

const router = express.Router();

// Create a session
router.post("/", createSession);

// Update a session
router.put("/:id", updateSession);

// Delete a session
router.delete("/:id", deleteSession);

export default router;
