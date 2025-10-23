import { Booking } from "../models/booking.model.js";
import { Cart } from "../models/cart.model.js";
import { ApiError } from "../utils/ApiError.js";
import { updateUserAchievement } from "../utils/updateUserAchievement.js";
import { UserAdventureExperience } from "../models/userAdventureExperience.model.js";

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
        const populatedBooking = await Booking.findById(booking._id).populate({
          path: "session",
          populate: {
            path: "adventureId",
            select: "exp"
          },
          select: "instructorId adventureId",
        });

        // Add experience for the adventure
        if (populatedBooking?.session?.adventureId) {
          const expAmount = populatedBooking.session.adventureId.exp || 50; // Default 50 if no exp defined
          await UserAdventureExperience.addExperience(
            booking.user._id,
            populatedBooking.session.adventureId._id,
            expAmount
          );
        }

        // Update achievements after adding experience
        await updateUserAchievement(booking.user._id);

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

  // Handle PayPal webhook for event bookings
  eventBookingPayPal = async (orderId, paypalStatus, booking) => {
    // PayPal status values: APPROVED, VOIDED, COMPLETED, PAYER_ACTION_REQUIRED
    if (paypalStatus === "APPROVED" || paypalStatus === "COMPLETED") {
      if (!booking) {
        return { status: 200, message: "Webhook received" };
      }

      booking.paymentStatus = "completed";
      booking.status = "confirmed";
      booking.paymentCompletedAt = new Date();
      await booking.save();

      return {
        status: 200,
        message: "PayPal payment completed successfully",
        booking: booking,
      };
    } else if (paypalStatus === "VOIDED") {
      if (booking) {
        booking.paymentStatus = "failed";
        booking.status = "failed";
        await booking.save();
      }

      return {
        status: 200,
        message: "PayPal payment failed",
        booking: booking,
      };
    }

    return { status: 200, message: "Webhook received" };
  };
}
