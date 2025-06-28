import ApiResponse from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Cart } from '../models/cart.model.js';
import { ItemBooking } from "../models/itemBooking.model.js";
import { PaymentService } from "../services/payment.service.js";
import { HotelBooking } from "../models/hotelBooking.model.js";
import { Booking } from "../models/booking.model.js";
import axios from 'axios';
import { createRevolutOrder } from "../utils/revolut.js";

export const createBooking = asyncHandler(async (req, res) => {
    const { name } = req.query;

    if (req.user.name.toLowerCase() !== name.toLowerCase()) {
        throw new ApiError(401, "You are not authorized to perform this action");
    }

    const userId = req.user._id;

    const cart = await Cart.findOne({ user: userId })
        .populate({
            path: "items.item",
            select: "price rentalPrice",
        });

    if (!cart) {
        throw new ApiError(404, "Cart not found");
    } const totalPrice = cart.items.reduce((sum, item) => {
        if (item.purchase) {
            sum += item.item.price * item.quantity;
        }
        else {
            // For rental items, calculate based on rental period
            const startDate = new Date(item.rentalPeriod.startDate);
            const endDate = new Date(item.rentalPeriod.endDate);
            const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
            sum += item.item.rentalPrice * item.quantity * days;
        } return sum;
    }, 0);

    // Create Revolut payment order
    const revolutOrder = await createRevolutOrder(totalPrice, 'GBP', `Item Booking - User: ${req.user.name}`);
    const booking = await ItemBooking.create({
        amount: totalPrice,
        user: userId,
        items: cart.items,
        paymentOrderId: revolutOrder.id, // Store Revolut order ID for reference
        paymentStatus: 'pending'
    });

    res.status(201).json(new ApiResponse(201, {
        booking,
        paymentOrder: revolutOrder
    }, "Booking Created with Payment Order"));

});


// Function to handle payment completion/webhook
export const handlePaymentCompletion = asyncHandler(async (req, res) => {
    try {
        const { event, order_id } = req.body;

        if (!event || !order_id) {
            throw new ApiError(400, "Invalid webhook payload");
        }

        const paymentService = new PaymentService();
        const processedBookings = [];

        // Check for item booking
        const booking = await ItemBooking.findOne({ paymentOrderId: order_id })
            .populate('user', 'name email');

        if (booking) {
           const result = await paymentService.itemBooking(order_id, event, booking);
           processedBookings.push({ type: 'item', result });
        }

        // Check for hotel booking
        const hotelBooking = await HotelBooking.findOne({ transactionId: order_id });

        if (hotelBooking) {
            const result = await paymentService.hotelBooking(order_id, event, hotelBooking);
            processedBookings.push({ type: 'hotel', result });
        }

        // Check for session booking
        const sessionBooking = await Booking.findOne({ transactionId: order_id })
            .populate('user', 'name email');

        if (sessionBooking) {
            const result = await paymentService.sessionBooking(order_id, event, sessionBooking);
            processedBookings.push({ type: 'session', result });
        }

        console.log('Processed Bookings:', processedBookings);
        // Return response based on processed bookings
        if (processedBookings.length > 0) {
            res.status(200).json(new ApiResponse(200, { 
                processedBookings,
                totalProcessed: processedBookings.length 
            }, `Payment completed successfully for ${processedBookings.length} booking(s)`));
        } else {
            // If no booking is found, still return success to acknowledge webhook
            res.status(200).json({ message: "Webhook received - no matching booking found" });
        }

    } catch (error) {
        res.status(200).json({ message: "Webhook received with errors" });
    }
});

// Function to check payment status
export const getPaymentStatus = asyncHandler(async (req, res) => {
    const { bookingId } = req.params;

    const booking = await ItemBooking.findById(bookingId)
        .populate('user', 'name email')
        .populate('items.item', 'name price rentalPrice');

    if (!booking) {
        throw new ApiError(404, "Booking not found");
    }

    // Check if user is authorized to view this booking
    if (booking.user._id.toString() !== req.user._id.toString()) {
        throw new ApiError(401, "You are not authorized to view this booking");
    }

    res.status(200).json(new ApiResponse(200, {
        bookingId: booking._id,
        paymentOrderId: booking.paymentOrderId,
        paymentStatus: booking.paymentStatus,
        amount: booking.amount,
        paymentCompletedAt: booking.paymentCompletedAt
    }, "Payment status retrieved successfully"));
});

// Function to get order details from Revolut
export const getOrderDetails = asyncHandler(async (req, res) => {
    const { orderId } = req.params;

    if (!orderId) {
        throw new ApiError(400, "Order ID is required");
    }

    try {
        const config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: `https://sandbox-merchant.revolut.com/api/orders/${orderId}`,
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${process.env.REVOLUT_SECRET_API_KEY}`,
                'Revolut-Api-Version': '2024-09-01'
            }
        };

        const response = await axios(config);

        // Also get booking details from database
        const booking = await ItemBooking.findOne({ paymentOrderId: orderId })
            .populate({
                path: 'items.item',
                select: 'name price rentalPrice images category'
            })
            .populate('user', 'name email');

        res.status(200).json(new ApiResponse(200, {
            revolutOrder: response.data,
            booking: booking
        }, "Order details retrieved successfully"));

    } catch (error) {
        console.error('Get order details error:', error.response?.data || error.message);
        throw new ApiError(500, 'Failed to get order details');
    }
});

// Function to setup Revolut webhook
export const setupWebhook = asyncHandler(async (req, res) => {
    try {
        const webhookUrl = process.env.NODE_ENV === 'production'
            ? 'https://yourdomain.com/api/item-booking/webhook/payment-completed'
            : 'https://4f93-2405-201-a423-5801-702b-aa6e-bdc3-2a08.ngrok-free.app/api/item-booking/webhook/payment-completed';

        const data = JSON.stringify({
            "url": webhookUrl,
            "events": [
                "ORDER_COMPLETED",
                "ORDER_AUTHORISED"
            ]
        });

        const config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'https://sandbox-merchant.revolut.com/api/1.0/webhooks',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${process.env.REVOLUT_SECRET_API_KEY}`
            },
            data: data
        };

        const response = await axios(config);

        res.status(200).json(new ApiResponse(200, response.data, "Webhook setup successfully"));
    } catch (error) {
        console.error('Webhook setup error:', error.response?.data || error.message);
        throw new ApiError(500, 'Failed to setup webhook');
    }
});

// Get current user's item bookings
export const getMyItemBookings = asyncHandler(async (req, res) => {
    const {
        page = 1,
        limit = 10,
        status,
        sortBy = "createdAt",
        sortOrder = "desc"
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Build query object
    let query = { user: req.user._id };

    if (status) {
        query.status = status;
    }

    // Sorting
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === "asc" ? 1 : -1;
    const bookings = await ItemBooking.find(query)
        .sort(sortOptions)
        .skip(skip)
        .limit(parseInt(limit))
        .populate("user", "name email phoneNumber")
        .populate({
            path: "items.item",
            select: "name price rentalPrice images category"
        });

    const total = await ItemBooking.countDocuments(query);

    return res.status(200).json(
        new ApiResponse(200, {
            bookings,
            total,
            page: parseInt(page),
            totalPages: Math.ceil(total / limit),
        }, "Item bookings retrieved successfully")
    );
});

export const getAllItemBookings = asyncHandler(async (req, res) => {
    const {
        page = 1,
        limit = 10,
        status,
        sortBy = "createdAt",
        sortOrder = "desc"
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Build query object
    let query = {};

    if (status) {
        query.status = status;
    }

    // Sorting
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === "asc" ? 1 : -1;

    const bookings = await ItemBooking.find(query)
        .sort(sortOptions)
        .skip(skip)
        .limit(parseInt(limit))
        .populate("user", "name email phoneNumber")
        .populate({
            path: "items.item",
            select: "name price rentalPrice images category"
        });

    const total = await ItemBooking.countDocuments(query);

    return res.status(200).json(
        new ApiResponse(200, {
            data: bookings,
            total,
            page: parseInt(page),
            totalPages: Math.ceil(total / limit),
        }, "All item bookings retrieved successfully")
    );
});