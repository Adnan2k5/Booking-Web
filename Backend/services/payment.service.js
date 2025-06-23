import { Cart } from '../models/cart.model.js';
import { Booking } from '../models/booking.model.js';
import { ApiError } from "../utils/ApiError.js";

export class PaymentService {
    itemBooking = async (order_id, event, booking) => {
        // Check if this is an order completion event
        if (event === 'ORDER_COMPLETED' || event === 'ORDER_AUTHORISED') {

            if (!booking) {
                return res.status(200).json({ message: "Webhook received" });
            }

            if (event === 'ORDER_COMPLETED') {
                booking.paymentStatus = 'completed';
                booking.status = 'confirmed';
                booking.paymentCompletedAt = new Date();

                await Cart.findOneAndUpdate(
                    { user: booking.user._id },
                    { $set: { items: [] } }
                );

            } else if (event === 'ORDER_AUTHORISED') {
                booking.paymentStatus = 'completed';
            }

            await booking.save();

            return {
                status: 200,
                message: "Payment completed successfully",
                booking: booking
            };
        } else {
            throw new ApiError(400, `Unsupported event type: ${event}`);
        }
    }

    hotelBooking = async (order_id, event, booking) => {
        // Check if this is an order completion event
        if (event === 'ORDER_COMPLETED' || event === 'ORDER_AUTHORISED') {

            if (!booking) {
                return { status: 200, message: "Webhook received" };
            }

            if (event === 'ORDER_COMPLETED') {
                booking.paymentStatus = 'completed';
                booking.status = 'confirmed';
            } else if (event === 'ORDER_AUTHORISED') {
                booking.paymentStatus = 'completed';
            }

            await booking.save();

            return {
                status: 200,
                message: "Payment completed successfully",
                booking: booking
            };
        } else {
            throw new ApiError(400, `Unsupported event type: ${event}`);
        }
    }
}