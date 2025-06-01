import express from "express";
import { createBooking } from "../controllers/itemBooking.controller.js";
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Middleware to verify JWT token
router.use(verifyJWT);

router.get(
    '/create', createBooking
);

export default router;