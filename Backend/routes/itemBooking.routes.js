import express from "express";
import { 
    createBooking, 
    handlePaymentCompletion,
    getPaymentStatus,
    getOrderDetails,
    setupWebhook,
    getMyItemBookings,
    getAllItemBookings
} from "../controllers/itemBooking.controller.js";
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Webhook endpoint (no auth required)
router.post('/webhook/payment-completed', handlePaymentCompletion);

// Setup webhook endpoint (admin only)
router.post('/setup-webhook', verifyJWT, setupWebhook);

// Middleware to verify JWT token for authenticated routes
router.use(verifyJWT);

// Legacy cart-based booking
router.get('/create', createBooking);

// Get payment status
router.get('/payment-status/:bookingId', getPaymentStatus);

// Get current user's item bookings
router.get('/my-bookings', getMyItemBookings);
router.get('/all-bookings', getAllItemBookings); // Alias for backward compatibility

// Get order details
router.get('/order/:orderId', getOrderDetails);

export default router;