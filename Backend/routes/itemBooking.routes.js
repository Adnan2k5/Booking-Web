import express from "express";
import { createBooking, createDirectBooking } from "../controllers/itemBooking.controller.js";
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Middleware to verify JWT token
router.use(verifyJWT);

// Legacy cart-based booking
router.get(
    '/create', createBooking
);

// New direct booking without cart
router.post(
    '/create-direct', createDirectBooking
);

export default router;