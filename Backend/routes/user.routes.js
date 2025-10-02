import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  getUser,
  getUsers,
  deleteUser,
  getUserAdventureExperiences,
  getUserAdventure,
  getMe,
} from "../controllers/user.controller.js";
import { getUserAchievements } from "../controllers/Achievment.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = express.Router();

router.get("/me", verifyJWT, getMe);
router.get("/profile", verifyJWT, getUser);
router.get("/adventure-experiences", verifyJWT, getUserAdventureExperiences);
router.get("/adventure", verifyJWT, getUserAdventure);
router.get("/", verifyJWT, getUsers);
router.delete("/:id", verifyJWT, deleteUser);
router.get("/getUserAchievements", verifyJWT, getUserAchievements);

export default router;
