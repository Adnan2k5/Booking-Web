import express from "express";
import { getUserAchievements } from "../controllers/Achievement.js";
import {
  deleteUser,
  getMe,
  getUser,
  getUserAdventure,
  getUserAdventureExperiences,
  getUsers,
  updateUserProfile,
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/me", verifyJWT, getMe);
router.get("/profile", verifyJWT, getUser);
router.put("/profile", verifyJWT, updateUserProfile);
router.get("/adventure-experiences", verifyJWT, getUserAdventureExperiences);
router.get("/adventure", verifyJWT, getUserAdventure);
router.get("/", verifyJWT, getUsers);
router.delete("/:id", verifyJWT, deleteUser);
router.get("/getUserAchievements", verifyJWT, getUserAchievements);

export default router;
