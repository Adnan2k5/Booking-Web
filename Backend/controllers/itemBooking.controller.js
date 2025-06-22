import ApiResponse from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Cart } from '../models/cart.model.js';
import { ItemBooking } from "../models/itemBooking.model.js";
import axios from 'axios';

// Helper function to create Revolut payment order
const createRevolutOrder = async (amount, currency = 'GBP', description = 'Item Booking Payment') => {
    try {
        // Validate inputs
        if (!amount || amount <= 0) {
            throw new Error('Invalid amount provided');
        }

        if (!process.env.REVOLUT_SECRET_API_KEY) {
            throw new Error('Revolut API key not configured');
        }

        const redirectUrl = process.env.NODE_ENV === 'production' 
            ? 'https://yourdomain.com/cart/success'
            : 'https://4f93-2405-201-a423-5801-702b-aa6e-bdc3-2a08.ngrok-free.app/cart/success';

        const requestPayload = {
            amount: Math.round(amount * 100), // Convert to pence/cents as Revolut expects smallest currency unit
            currency: currency.toUpperCase(),
            description: description.substring(0, 255), // Limit description length
            capture_mode: 'automatic', // Changed to automatic capture
            redirect_url: redirectUrl
        };

        // Log the request data for debugging
        console.log('Revolut API Request Data:', JSON.stringify(requestPayload, null, 2));

        const config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'https://sandbox-merchant.revolut.com/api/orders',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${process.env.REVOLUT_SECRET_API_KEY}`,
                'Revolut-Api-Version': '2024-09-01'
            },
            data: JSON.stringify(requestPayload)
        };

        console.log('Making request to Revolut API...');
        const response = await axios(config);
        console.log('Revolut API Response:', response.data);
        return response.data;
    } catch (error) {
        // Enhanced error logging
        console.error('Revolut order creation error:');
        console.error('Error message:', error.message);
        console.error('Response status:', error.response?.status);
        console.error('Response data:', error.response?.data);
        
        if (error.response?.data) {
            throw new ApiError(500, `Revolut API Error: ${error.response.data.message || 'Failed to create payment order'}`);
        } else {
            throw new ApiError(500, `Payment service error: ${error.message}`);
        }
    }
};

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

// New direct booking function that doesn't rely on cart
export const createDirectBooking = asyncHandler(async (req, res) => {
    const { items } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
        throw new ApiError(400, "Items array is required and cannot be empty");
    }

    const userId = req.user._id;

    // Validate item structure and fetch item details for pricing
    const validatedItems = await Promise.all(items.map(async (item) => {
        if (!item.item || !item.quantity || item.quantity <= 0) {
            throw new ApiError(400, "Each item must have valid item ID and quantity");
        }

        // Ensure dates are provided for rental items
        if (!item.purchased && (!item.startDate || !item.endDate)) {
            throw new ApiError(400, "Start date and end date are required for rental items");
        }        // Validate dates for rental items
        if (!item.purchased && item.startDate && item.endDate) {
            const startDate = new Date(item.startDate);
            const endDate = new Date(item.endDate);

            if (startDate >= endDate) {
                throw new ApiError(400, "End date must be after start date for rental items");
            }

            // Check if start date is in the past (allow same day bookings)
            const today = new Date();
            today.setHours(0, 0, 0, 0); // Set to start of today
            const startDateOnly = new Date(startDate);
            startDateOnly.setHours(0, 0, 0, 0); // Set to start of start date

            if (startDateOnly < today) {
                throw new ApiError(400, "Start date cannot be in the past");
            }
        }

        return {
            item: item.item,
            quantity: item.quantity,
            purchased: item.purchased || false,
            startDate: item.startDate || null,
            endDate: item.endDate || null
        };
    }));

    // Calculate total amount by fetching item details
    let totalAmount = 0;
    const itemsWithDetails = await Promise.all(validatedItems.map(async (validatedItem) => {
        const { Item } = await import('../models/item.model.js');
        const itemDetails = await Item.findById(validatedItem.item).select('price rentalPrice purchase rent');

        if (!itemDetails) {
            throw new ApiError(404, `Item with ID ${validatedItem.item} not found`);
        }

        // Check if item supports the requested booking type
        if (validatedItem.purchased && !itemDetails.purchase) {
            throw new ApiError(400, `Item ${validatedItem.item} is not available for purchase`);
        }

        if (!validatedItem.purchased && !itemDetails.rent) {
            throw new ApiError(400, `Item ${validatedItem.item} is not available for rent`);
        }

        let itemTotal = 0;
        if (validatedItem.purchased) {
            // Purchase calculation
            itemTotal = itemDetails.price * validatedItem.quantity;
        } else {
            // Rental calculation
            const startDate = new Date(validatedItem.startDate);
            const endDate = new Date(validatedItem.endDate);
            const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
            itemTotal = itemDetails.rentalPrice * validatedItem.quantity * days;
        }

        totalAmount += itemTotal;

        return {
            ...validatedItem,
            rentalPeriod: !validatedItem.purchased ? {
                startDate: validatedItem.startDate,
                endDate: validatedItem.endDate,
                days: validatedItem.startDate && validatedItem.endDate
                    ? Math.ceil((new Date(validatedItem.endDate) - new Date(validatedItem.startDate)) / (1000 * 60 * 60 * 24))
                    : null
            } : undefined
        };
    }));

    // Create Revolut payment order
    const revolutOrder = await createRevolutOrder(totalAmount, 'GBP', `Direct Item Booking - User: ${req.user.name}`);

    const booking = await ItemBooking.create({
        amount: totalAmount,
        user: userId,
        items: itemsWithDetails,
        paymentOrderId: revolutOrder.id, // Store Revolut order ID for reference
        paymentStatus: 'pending'
    });

    // Populate the created booking with item details
    const populatedBooking = await ItemBooking.findById(booking._id)
        .populate({
            path: 'items.item',
            select: 'name price rentalPrice images category'
        })
        .populate('user', 'name email');

    res.status(201).json(new ApiResponse(201, {
        booking: populatedBooking,
        paymentOrder: revolutOrder
    }, "Direct Booking Created Successfully with Payment Order"));
});

// Function to handle payment completion/webhook
export const handlePaymentCompletion = asyncHandler(async (req, res) => {
    try {
        console.log('Webhook received:', JSON.stringify(req.body, null, 2));
        
        const { event, order_id } = req.body;

        if (!event || !order_id) {
            throw new ApiError(400, "Invalid webhook payload");
        }

        // Check if this is an order completion event
        if (event === 'ORDER_COMPLETED' || event === 'ORDER_AUTHORISED') {
            const orderId = order_id; // Use the order ID from the webhook payload
            // Find booking by payment order ID
            const booking = await ItemBooking.findOne({ paymentOrderId: orderId })
                .populate('user', 'name email');

            if (!booking) {
                console.log(`Booking not found for order ID: ${orderId}`);
                // Return 200 to acknowledge webhook receipt even if booking not found
                return res.status(200).json({ message: "Webhook received" });
            }

            // Update payment status based on event type
            if (event === 'ORDER_COMPLETED') {
                booking.paymentStatus = 'completed';
                booking.status = 'confirmed'; // Update booking status to confirmed
                booking.paymentCompletedAt = new Date();
                
                // Clear user's cart after successful payment
                await Cart.findOneAndUpdate(
                    { user: booking.user._id },
                    { $set: { items: [] } }
                );
                
                console.log(`Payment completed for booking ${booking._id}`);
            } else if (event === 'ORDER_AUTHORISED') {
                booking.paymentStatus = 'completed';
                console.log(`Payment authorized for booking ${booking._id}`);
            }

            await booking.save();

            // Return 200 to acknowledge successful webhook processing
            res.status(200).json({ 
                message: "Webhook processed successfully",
                bookingId: booking._id,
                status: booking.paymentStatus
            });
        } else {
            // For other events, just acknowledge receipt
            res.status(200).json({ message: "Webhook received but not processed" });
        }
    } catch (error) {
        console.error('Webhook processing error:', error);
        // Return 200 to prevent webhook retries for application errors
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