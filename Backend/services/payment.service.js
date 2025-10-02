import { Cart } from "../models/cart.model.js";
import { Booking } from "../models/booking.model.js";
import { ApiError } from "../utils/ApiError.js";
import { updateUserAchievment } from "../utils/updateUserAchievment.js";

export class PaymentService {
  itemBooking = async (order_id, event, booking) => {
    // Check if this is an order completion event
    if (event === "ORDER_COMPLETED" || event === "ORDER_AUTHORISED") {
      if (!booking) {
        return res.status(200).json({ message: "Webhook received" });
      }

      if (event === "ORDER_COMPLETED") {
        booking.paymentStatus = "completed";
        booking.status = "confirmed";
        booking.paymentCompletedAt = new Date();

        await Cart.findOneAndUpdate(
          { user: booking.user._id },
          { $set: { items: [] } }
        );
      } else if (event === "ORDER_AUTHORISED") {
        booking.paymentStatus = "completed";
      }

      await booking.save();

      return {
        status: 200,
        message: "Payment completed successfully",
        booking: booking,
      };
    } else {
      throw new ApiError(400, `Unsupported event type: ${event}`);
    }
  };

  hotelBooking = async (order_id, event, booking) => {
    // Check if this is an order completion event
    if (event === "ORDER_COMPLETED" || event === "ORDER_AUTHORISED") {
      if (!booking) {
        return { status: 200, message: "Webhook received" };
      }

      if (event === "ORDER_COMPLETED") {
        booking.paymentStatus = "completed";
        booking.status = "confirmed";
      } else if (event === "ORDER_AUTHORISED") {
        booking.paymentStatus = "completed";
      }

      await booking.save();

      return {
        status: 200,
        message: "Payment completed successfully",
        booking: booking,
      };
    } else {
      throw new ApiError(400, `Unsupported event type: ${event}`);
    }
  };

  eventBooking = async (order_id, event, booking) => {
    // Check if this is an order completion event
    if (event === "ORDER_COMPLETED" || event === "ORDER_AUTHORISED") {
      if (!booking) {
        return { status: 200, message: "Webhook received" };
      }

      if (event === "ORDER_COMPLETED") {
        booking.paymentStatus = "completed";
        booking.status = "confirmed";
        booking.paymentCompletedAt = new Date();
      } else if (event === "ORDER_AUTHORISED") {
        booking.paymentStatus = "completed";
        booking.status = "confirmed";
      }

      await booking.save();

      return {
        status: 200,
        message: "Event booking payment completed successfully",
        booking: booking,
      };
    } else if (event === "ORDER_FAILED") {
      if (booking) {
        booking.paymentStatus = "failed";
        booking.status = "failed";
        await booking.save();
      }

      return {
        status: 200,
        message: "Event booking payment failed",
        booking: booking,
      };
    } else {
      throw new ApiError(400, `Unsupported event type: ${event}`);
    }
  };

  sessionBooking = async (order_id, event, booking) => {
    // Check if this is an order completion event
    if (event === "ORDER_COMPLETED" || event === "ORDER_AUTHORISED") {
      if (!booking) {
        return { status: 200, message: "Webhook received" };
      }

      // For session bookings, we only update the status since there's no paymentStatus field
      if (event === "ORDER_COMPLETED" || event === "ORDER_AUTHORISED") {
        // Todo funcion chalana h
        await updateUserAchievment(booking.user._id);
        booking.status = "confirmed";
      }

      await booking.save();

      return {
        status: 200,
        message: "Payment completed successfully",
        booking: booking,
      };
    } else {
      throw new ApiError(400, `Unsupported event type: ${event}`);
    }
  };
}
