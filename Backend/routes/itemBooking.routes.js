import express from "express";
import { 
    createBooking, 
    createDirectBooking, 
    capturePaymentOrder, 
    handlePaymentRedirect, 
    getOrderDetails 
} from "../controllers/itemBooking.controller.js";
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Public route for handling payment redirect (no auth needed)
router.get('/payment/redirect', handlePaymentRedirect);

// Middleware to verify JWT token for authenticated routes
router.use(verifyJWT);

// Legacy cart-based booking
router.get('/create', createBooking);

// New direct booking without cart
router.post('/create-direct', createDirectBooking);

// Capture payment order
router.post('/capture/:orderId', capturePaymentOrder);

// Get order details
router.get('/order/:orderId', getOrderDetails);

export default router;