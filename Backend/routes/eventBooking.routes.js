import express from "express";
import {
  createEventBooking,
  handleEventBookingWebhook,
  getEventBookingById,
  getMyEventBookings,
  cancelEventBooking,
  getAllEventBookings,
  getPaymentStatus,
  getOrderDetails,
  setupWebhook,
} from "../controllers/eventBooking.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { verifyAdmin } from "../middlewares/admin.middleware.js";

const router = express.Router();

// Public routes
router.post("/webhook", handleEventBookingWebhook); // Webhook for payment updates

// Protected routes (require authentication)
router.use(verifyJWT);

router.post("/", createEventBooking); // Create event booking with payment order
router.get("/user", getMyEventBookings); // Get current user's event bookings
router.get("/:id", getEventBookingById); // Get specific event booking
router.get("/:bookingId/payment-status", getPaymentStatus); // Get payment status
router.get("/order/:orderId", getOrderDetails); // Get order details from Revolut
router.patch("/:id/cancel", cancelEventBooking); // Cancel event booking
router.post("/setup-webhook", setupWebhook); // Setup Revolut webhook

// Admin routes
router.get("/", verifyAdmin, getAllEventBookings); // Admin: Get all event bookings

export default router;
