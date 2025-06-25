import express from "express";
import {
  createEventBookingPaymentSession,
  createEventBooking,
  getEventBookingById,
  getUserEventBookings,
  cancelEventBooking,
  getAllEventBookings,
  handleEventBookingWebhook,
} from "../controllers/eventBooking.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { verifyAdmin } from "../middlewares/admin.middleware.js";

const router = express.Router();

// Public routes
router.post("/webhook", handleEventBookingWebhook); // Webhook for payment updates

// Protected routes (require authentication)
router.use(verifyJWT);

router.post("/payment-session", createEventBookingPaymentSession); // Create payment session
router.post("/", createEventBooking); // Create actual booking (after payment)
router.get("/user", getUserEventBookings); // Get user's event bookings
router.get("/:id", getEventBookingById); // Get specific event booking
router.patch("/:id/cancel", cancelEventBooking); // Cancel event booking

// Admin routes
router.get("/", verifyAdmin, getAllEventBookings); // Admin: Get all event bookings

export default router;
