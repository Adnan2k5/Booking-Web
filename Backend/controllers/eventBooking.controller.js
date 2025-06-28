import ApiResponse from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { EventBooking } from "../models/eventBooking.model.js";
import { Event } from "../models/events.model.js";
import { PaymentService } from "../services/payment.service.js";
import axios from "axios";
import { createRevolutOrder } from "../utils/revolut.js";

export const createEventBooking = asyncHandler(async (req, res) => {
  const { event, participants, contactInfo, amount, paymentMethod } = req.body;

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
  const existingConfirmedBooking = await EventBooking.findOne({
    user: req.user._id,
    event: event,
    status: { $in: ["confirmed", "completed"] },
  });

  if (existingConfirmedBooking) {
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

  // Create Revolut payment order
  const revolutOrder = await createRevolutOrder(
    amount,
    "GBP",
    `Event Booking - ${eventExists.title} - User: ${
      req.user.name || req.user.email
    }`,
    process.env.NODE_ENV === "production"
      ? `${process.env.CLIENT_URL}/event-booking-confirmation`
      : `http://localhost:5173/event-booking-confirmation`
  );

  const booking = await EventBooking.create({
    user: req.user._id,
    event,
    participants,
    contactInfo,
    amount,
    paymentMethod: paymentMethod || "revolut",
    paymentOrderId: revolutOrder.id, // Store Revolut order ID for reference
    paymentStatus: "pending",
    status: "pending",
  });

  // Populate the created booking with event details
  const populatedBooking = await EventBooking.findById(booking._id)
    .populate(
      "event",
      "title description date startTime endTime location city country image"
    )
    .populate("user", "name email");

  res.status(201).json(
    new ApiResponse(
      201,
      {
        booking: populatedBooking,
        paymentOrder: revolutOrder,
      },
      "Event Booking Created with Payment Order"
    )
  );
});

// Function to handle payment completion/webhook
export const handleEventBookingWebhook = asyncHandler(async (req, res) => {
  try {
    const { event, order_id } = req.body;

    if (!event || !order_id) {
      throw new ApiError(400, "Invalid webhook payload");
    }

    const booking = await EventBooking.findOne({
      paymentOrderId: order_id,
    }).populate("user", "name email");

    const paymentService = new PaymentService();
    if (booking) {
      const result = await paymentService.eventBooking(
        order_id,
        event,
        booking
      );
      console.log("Payment result:", result);
      res
        .status(result.status)
        .json(new ApiResponse(result.status, result.booking, result.message));
      return;
    }

    // If no event booking found, return success to prevent webhook retries
    res
      .status(200)
      .json({ message: "Webhook received - no event booking found" });
  } catch (error) {
    console.error("Webhook error:", error);
    res.status(200).json({ message: "Webhook received with errors" });
  }
});

// Function to check payment status
export const getPaymentStatus = asyncHandler(async (req, res) => {
  const { bookingId } = req.params;

  const booking = await EventBooking.findById(bookingId)
    .populate("user", "name email")
    .populate(
      "event",
      "title description date startTime endTime location city country image"
    );

  if (!booking) {
    throw new ApiError(404, "Booking not found");
  }

  // Check if user is authorized to view this booking
  if (booking.user._id.toString() !== req.user._id.toString()) {
    throw new ApiError(401, "You are not authorized to view this booking");
  }

  res.status(200).json(
    new ApiResponse(
      200,
      {
        bookingId: booking._id,
        paymentOrderId: booking.paymentOrderId,
        paymentStatus: booking.paymentStatus,
        status: booking.status,
        amount: booking.amount,
        paymentCompletedAt: booking.paymentCompletedAt,
      },
      "Payment status retrieved successfully"
    )
  );
});

// Function to get order details from Revolut
export const getOrderDetails = asyncHandler(async (req, res) => {
  const { orderId } = req.params;

  if (!orderId) {
    throw new ApiError(400, "Order ID is required");
  }

  try {
    const config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `https://sandbox-merchant.revolut.com/api/orders/${orderId}`,
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${process.env.REVOLUT_SECRET_API_KEY}`,
        "Revolut-Api-Version": "2024-09-01",
      },
    };

    const response = await axios(config);

    // Also get booking details from database
    const booking = await EventBooking.findOne({ paymentOrderId: orderId })
      .populate(
        "event",
        "title description date startTime endTime location city country image"
      )
      .populate("user", "name email");

    res.status(200).json(
      new ApiResponse(
        200,
        {
          revolutOrder: response.data,
          booking: booking,
        },
        "Order details retrieved successfully"
      )
    );
  } catch (error) {
    console.error(
      "Get order details error:",
      error.response?.data || error.message
    );
    throw new ApiError(500, "Failed to get order details");
  }
});

// Function to setup Revolut webhook
export const setupWebhook = asyncHandler(async (req, res) => {
  try {
    const webhookUrl =
      process.env.NODE_ENV === "production"
        ? "https://yourdomain.com/api/event-bookings/webhook"
        : "https://4f93-2405-201-a423-5801-702b-aa6e-bdc3-2a08.ngrok-free.app/api/event-bookings/webhook";

    const data = JSON.stringify({
      url: webhookUrl,
      events: ["ORDER_COMPLETED", "ORDER_AUTHORISED", "ORDER_FAILED"],
    });

    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://sandbox-merchant.revolut.com/api/1.0/webhooks",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${process.env.REVOLUT_SECRET_API_KEY}`,
      },
      data: data,
    };

    const response = await axios(config);

    res
      .status(200)
      .json(new ApiResponse(200, response.data, "Webhook setup successfully"));
  } catch (error) {
    console.error(
      "Webhook setup error:",
      error.response?.data || error.message
    );
    throw new ApiError(500, "Failed to setup webhook");
  }
});

// Get event booking by ID
export const getEventBookingById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const booking = await EventBooking.findById(id)
    .populate(
      "event",
      "title description date startTime endTime location city country image"
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

  res
    .status(200)
    .json(
      new ApiResponse(200, booking, "Event booking retrieved successfully")
    );
});

// Get current user's event bookings
export const getMyEventBookings = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    status,
    sortBy = "createdAt",
    sortOrder = "desc",
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

  const bookings = await EventBooking.find(query)
    .sort(sortOptions)
    .skip(skip)
    .limit(parseInt(limit))
    .populate("user", "name email")
    .populate(
      "event",
      "title description date startTime endTime location city country image"
    );

  const total = await EventBooking.countDocuments(query);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        bookings,
        total,
        page: parseInt(page),
        totalPages: Math.ceil(total / limit),
      },
      "Event bookings retrieved successfully"
    )
  );
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

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedBooking,
        "Event booking cancelled successfully"
      )
    );
});

// Admin: Get all event bookings
export const getAllEventBookings = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    status,
    paymentStatus,
    event,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = req.query;

  const skip = (parseInt(page) - 1) * parseInt(limit);

  // Build query object
  let query = {};
  if (status) query.status = status;
  if (paymentStatus) query.paymentStatus = paymentStatus;
  if (event) query.event = event;

  // Sorting
  const sortOptions = {};
  sortOptions[sortBy] = sortOrder === "asc" ? 1 : -1;

  const bookings = await EventBooking.find(query)
    .sort(sortOptions)
    .skip(skip)
    .limit(parseInt(limit))
    .populate(
      "event",
      "title description date startTime endTime location city country image"
    )
    .populate("user", "name email");

  const total = await EventBooking.countDocuments(query);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        data: bookings,
        total,
        page: parseInt(page),
        totalPages: Math.ceil(total / limit),
      },
      "All event bookings retrieved successfully"
    )
  );
});
