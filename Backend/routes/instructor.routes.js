import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";

import {
  changeDocumentStatusById,
  deleteInstructor,
  getAllInstructors,
  getInstructorAchievements,
  getInstructorById,
  addPortfolioMedia,
  removePortfolioMedia,
} from "../controllers/instructor.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = express.Router();

// Middleware to verify JWT token
router.use(verifyJWT);

// Route to get all instructors
router.get("/", getAllInstructors);
router.get("/getInstructorAchievement", verifyJWT, getInstructorAchievements);
router.post("/portfolio", upload.single("media"), addPortfolioMedia);
router.delete("/portfolio", removePortfolioMedia);
router.get("/:id", getInstructorById);
router.delete("/:id", deleteInstructor).put("/:id", changeDocumentStatusById);

export default router;
