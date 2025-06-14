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
        if(item.purchase) {
            sum += item.item.price * item.quantity; 
        }
        else {
            // For rental items, calculate based on rental period
            const startDate = new Date(item.rentalPeriod.startDate);
            const endDate = new Date(item.rentalPeriod.endDate);
            const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
            sum += item.item.rentalPrice * item.quantity * days;
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

    const booking = await ItemBooking.create({
        amount: totalAmount,
        user: userId,
        items: itemsWithDetails,
    });

    // Populate the created booking with item details
    const populatedBooking = await ItemBooking.findById(booking._id)
        .populate({
            path: 'items.item',
            select: 'name price rentalPrice images category'
        })
        .populate('user', 'name email');

    res.status(201).json(new ApiResponse(201, populatedBooking, "Direct Booking Created Successfully"));
});

