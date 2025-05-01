import express from "express";
import { createSession, updateSession, deleteSession } from "../controllers/session.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Create a session
router.post("/", verifyJWT, createSession);

// Update a session
router.put("/:id",verifyJWT, updateSession);

// Delete a session
router.delete("/:id", verifyJWT, deleteSession);

export default router;
