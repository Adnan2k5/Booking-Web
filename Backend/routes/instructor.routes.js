import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";

import {
  getAllInstructors,
  deleteInstructor,
  changeDocumentStatusById,
  getInstructorById,
} from "../controllers/instructor.controller.js";

const router = express.Router();

// Middleware to verify JWT token
router.use(verifyJWT);

// Route to get all instructors
router.get("/", getAllInstructors);
router.get("/:id", getInstructorById);
router.delete("/:id", deleteInstructor).put("/:id", changeDocumentStatusById);

export default router;
