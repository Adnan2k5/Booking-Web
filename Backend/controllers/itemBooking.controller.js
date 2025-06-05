import ApiResponse from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Cart } from '../models/cart.model.js';
import { ItemBooking } from "../models/itemBooking.model.js";

export const createBooking = asyncHandler(async (req, res) => {
    const { name } = req.query;

    if(req.user.name.toLowerCase() !== name.toLowerCase()) {
        throw new ApiError(401, "You are not authorized to perform this action");   
    }

    const userId = req.user._id;

    const cart = await Cart.findOne({ user: userId })
        .populate({
            path: "items.item",
            select: "price rentalPrice",
    });

    if(!cart) {
        throw new ApiError(404, "Cart not found");
    }    const totalPrice = cart.items.reduce((sum, item) => {
        if(item.purchased) {
            sum += item.item.price * item.quantity; 
        }
        else {
            sum += (item.item.price * item.quantity * (item.endDate - item.startDate));
        }
        return sum;
    }, 0);

    const booking = await ItemBooking.create({
        amount: totalPrice,
        user: userId,
        items: cart.items,
    });

    res.status(201).json(new ApiResponse(201, booking, "Booking Created"));
    
});

// New direct booking function that doesn't rely on cart
export const createDirectBooking = asyncHandler(async (req, res) => {
    const { items, totalAmount } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
        throw new ApiError(400, "Items array is required and cannot be empty");
    }

    if (!totalAmount || totalAmount <= 0) {
        throw new ApiError(400, "Total amount is required and must be greater than 0");
    }

    const userId = req.user._id;

    // Validate item structure
    const validatedItems = items.map(item => {
        if (!item.item || !item.quantity || item.quantity <= 0) {
            throw new ApiError(400, "Each item must have valid item ID and quantity");
        }

        // Ensure dates are provided for rental items
        if (!item.purchased && (!item.startDate || !item.endDate)) {
            throw new ApiError(400, "Start date and end date are required for rental items");
        }

        return {
            item: item.item,
            quantity: item.quantity,
            purchased: item.purchased || false,
            startDate: item.startDate || null,
            endDate: item.endDate || null
        };
    });

    const booking = await ItemBooking.create({
        amount: totalAmount,
        user: userId,
        items: validatedItems,
    });

    res.status(201).json(new ApiResponse(201, booking, "Direct Booking Created Successfully"));
});