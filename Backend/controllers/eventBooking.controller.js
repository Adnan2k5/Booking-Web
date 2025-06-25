import { EventBooking } from "../models/eventBooking.model.js";
import { Event } from "../models/events.model.js";
import { createRevolutOrder } from "../utils/revolut.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Create payment session for event booking (without creating the booking yet)
export const createEventBookingPaymentSession = asyncHandler(
  async (req, res) => {
    const {
      event,
      participants,
      contactInfo,
      specialRequests,
      amount,
      paymentMethod,
    } = req.body;

    // Validate required fields
    if (
      !event ||
      !participants ||
      !contactInfo?.email ||
      !contactInfo?.phone ||
      !amount
    ) {
      throw new ApiError(400, "All required fields must be provided");
    }

    // Check if event exists
    const eventExists = await Event.findById(event);
    if (!eventExists) {
      throw new ApiError(404, "Event not found");
    }

    // Check if user already has a confirmed booking for this event
    const existingBooking = await EventBooking.findOne({
      user: req.user._id,
      event: event,
      status: { $in: ["confirmed", "completed"] },
    });

    if (existingBooking) {
      throw new ApiError(400, "You already have a booking for this event");
    }

    // Clean up any existing pending bookings for this user and event in MongoDB
    // This handles cases where user started a payment but didn't complete it
    try {
      const deletedPendingBookings = await EventBooking.deleteMany({
        user: req.user._id,
        event: event,
        status: "pending",
        paymentStatus: { $in: ["pending", "failed"] },
      });

      if (deletedPendingBookings.deletedCount > 0) {
        console.log(
          `Cleaned up ${deletedPendingBookings.deletedCount} pending booking(s) for user ${req.user._id} and event ${event}`
        );
      }
    } catch (cleanupError) {
      console.error("Error cleaning up pending bookings:", cleanupError);
      // Continue with the process even if cleanup fails
    }

    let paymentOrder = null;

    // Create Revolut payment order if payment method is revolut
    if (paymentMethod === "revolut") {
      try {
        // Create custom redirect URL with booking data
        const redirectUrl =
          process.env.NODE_ENV === "production"
            ? `${process.env.CLIENT_URL}/event-booking-confirmation`
            : `http://localhost:5173/event-booking-confirmation`;

        paymentOrder = await createRevolutOrder(
          amount,
          "USD",
          `Event Booking - ${eventExists.title} - User: ${req.user.email}`,
          redirectUrl
        );

        // Create pending booking in MongoDB with payment order ID
        const pendingBooking = await EventBooking.create({
          user: req.user._id,
          event,
          participants,
          contactInfo,
          specialRequests,
          amount,
          paymentMethod,
          paymentOrderId: paymentOrder.id,
          status: "pending",
          paymentStatus: "pending",
        });
      } catch (error) {
        console.error("Payment order creation error:", error);
        throw new ApiError(500, "Failed to create payment order");
      }
    }

    res.status(201).json({
      success: true,
      message: "Payment session created successfully",
      paymentOrder: paymentOrder,
    });
  }
);

// Create actual event booking (called after payment confirmation)
export const createEventBooking = asyncHandler(async (req, res) => {
  const { paymentOrderId } = req.body;

  if (!paymentOrderId) {
    throw new ApiError(400, "Payment order ID is required");
  }

  // Get pending booking from MongoDB
  const pendingBooking = await EventBooking.findOne({
    paymentOrderId: paymentOrderId,
    status: "pending",
  });

  if (!pendingBooking) {
    throw new ApiError(404, "Pending booking not found or already processed");
  }

  // Double-check that the user matches
  if (pendingBooking.user.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Access denied");
  }

  // Update the pending booking to confirmed
  pendingBooking.status = "confirmed";
  pendingBooking.paymentStatus = "completed";
  pendingBooking.paymentCompletedAt = new Date();
  await pendingBooking.save();

  // Populate the booking with event and user details
  const populatedBooking = await EventBooking.findById(pendingBooking._id)
    .populate(
      "event",
      "title description date startTime endTime location city country image"
    )
    .populate("user", "name email");

  res.status(201).json({
    success: true,
    message: "Event booking created successfully",
    booking: populatedBooking,
  });
});

// Get event booking by ID
export const getEventBookingById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const booking = await EventBooking.findById(id)
    .populate(
      "event",
      "title description date startTime endTime location city country image medias"
    )
    .populate("user", "name email");

  if (!booking) {
    throw new ApiError(404, "Event booking not found");
  }

  // Check if user owns this booking or is admin
  if (
    booking.user._id.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    throw new ApiError(403, "Access denied");
  }

  res.json({
    success: true,
    booking,
  });
});

// Get user's event bookings
export const getUserEventBookings = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status } = req.query;

  const query = { user: req.user._id };
  if (status) {
    query.status = status;
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const limitNum = parseInt(limit);

  const bookings = await EventBooking.find(query)
    .populate(
      "event",
      "title description date startTime endTime location city country image medias"
    )
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limitNum);

  const total = await EventBooking.countDocuments(query);
  const totalPages = Math.ceil(total / limitNum);

  res.json({
    success: true,
    bookings,
    pagination: {
      page: parseInt(page),
      pages: totalPages,
      total,
      limit: limitNum,
    },
  });
});

// Cancel event booking
export const cancelEventBooking = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { cancelReason } = req.body;

  const booking = await EventBooking.findById(id);

  if (!booking) {
    throw new ApiError(404, "Event booking not found");
  }

  // Check if user owns this booking
  if (booking.user.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Access denied");
  }

  // Check if booking can be cancelled
  if (booking.status === "cancelled") {
    throw new ApiError(400, "Booking is already cancelled");
  }

  if (booking.status === "completed") {
    throw new ApiError(400, "Cannot cancel completed booking");
  }

  // Update booking status
  booking.status = "cancelled";
  booking.cancelledAt = new Date();
  booking.cancelReason = cancelReason || "Cancelled by user";

  await booking.save();

  // Populate the updated booking
  const updatedBooking = await EventBooking.findById(booking._id)
    .populate(
      "event",
      "title description date startTime endTime location city country image"
    )
    .populate("user", "name email");

  res.json({
    success: true,
    message: "Event booking cancelled successfully",
    booking: updatedBooking,
  });
});

// Admin: Get all event bookings
export const getAllEventBookings = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status, paymentStatus, event } = req.query;

  const query = {};
  if (status) query.status = status;
  if (paymentStatus) query.paymentStatus = paymentStatus;
  if (event) query.event = event;

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const limitNum = parseInt(limit);

  const bookings = await EventBooking.find(query)
    .populate(
      "event",
      "title description date startTime endTime location city country image"
    )
    .populate("user", "name email")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limitNum);

  const total = await EventBooking.countDocuments(query);
  const totalPages = Math.ceil(total / limitNum);

  res.json({
    success: true,
    bookings,
    pagination: {
      page: parseInt(page),
      pages: totalPages,
      total,
      limit: limitNum,
    },
  });
});

// Webhook handler for payment status updates
export const handleEventBookingWebhook = asyncHandler(async (req, res) => {
  const { event, order_id } = req.body;

  if (!event || !order_id) {
    throw new ApiError(400, "Missing event or order_id in webhook");
  }

  // Find booking by payment order ID
  const existingBooking = await EventBooking.findOne({
    paymentOrderId: order_id,
  });

  if (!existingBooking) {
    return res.status(200).json({
      message: "Webhook received - no booking found for this order",
    });
  }

  // Handle payment completion
  if (event === "ORDER_COMPLETED" || event === "ORDER_AUTHORISED") {
    existingBooking.paymentStatus = "completed";
    existingBooking.status = "confirmed";
    existingBooking.paymentCompletedAt = new Date();
    await existingBooking.save();

    return res.status(200).json({
      success: true,
      message: "Event booking payment completed successfully",
      booking: existingBooking,
    });
  } else if (event === "ORDER_FAILED") {
    existingBooking.paymentStatus = "failed";
    existingBooking.status = "failed";
    await existingBooking.save();

    return res.status(200).json({
      success: true,
      message: "Event booking payment failed",
      booking: existingBooking,
    });
  }

  res.status(200).json({ message: "Webhook received - event not handled" });
});
