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
    }

    const totalPrice = cart.items.reduce((item, sum) => {
        if(item.purchased) {
            sum += item.item.price * item.quantity; 
        }
        else {
            sum += (item.item.price * item.quantity * (item.endDate - item.startDate));
        }
    });

    const booking = await ItemBooking.create({
        amount: totalPrice,
        user: userId,
        items: cart.items,
    });

    res.status(201).json(new ApiResponse(201, booking, "Booking Created"));
    
});