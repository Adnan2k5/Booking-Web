import ApiResponse from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Cart } from "../models/cart.model.js";
import { ItemBooking } from "../models/itemBooking.model.js";
import axios from "axios";

// Helper function to create Revolut payment order
const createRevolutOrder = async (
  amount,
  currency = "GBP",
  description = "Item Booking Payment"
) => {
  try {
    const data = JSON.stringify({
      amount: Math.round(amount * 100), // Convert to pence/cents as Revolut expects smallest currency unit
      currency: currency,
      description: description,
      capture_mode: "manual",
      redirect_url: "http://localhost:5173/cart/success",
    });

    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://sandbox-merchant.revolut.com/api/orders",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${process.env.REVOLUT_SECRET_API_KEY}`, // Store API key in environment variables
        "Revolut-Api-Version": "2024-09-01", // Add this required header
      },
      data: data,
    };

    const response = await axios(config);
    return response.data;
  } catch (error) {
    console.error(
      "Revolut order creation error:",
      error.response?.data || error.message
    );
    throw new ApiError(500, "Failed to create payment order");
  }
};

export const createBooking = asyncHandler(async (req, res) => {
  const { name } = req.query;

  if (req.user.name.toLowerCase() !== name.toLowerCase()) {
    throw new ApiError(401, "You are not authorized to perform this action");
  }

  const userId = req.user._id;

  const cart = await Cart.findOne({ user: userId }).populate({
    path: "items.item",
    select: "price rentalPrice",
  });

  if (!cart) {
    throw new ApiError(404, "Cart not found");
  }
  const totalPrice = cart.items.reduce((sum, item) => {
    if (item.purchase) {
      sum += item.item.price * item.quantity;
    } else {
      // For rental items, calculate based on rental period
      const startDate = new Date(item.rentalPeriod.startDate);
      const endDate = new Date(item.rentalPeriod.endDate);
      const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
      sum += item.item.rentalPrice * item.quantity * days;
    }
    return sum;
  }, 0);

  // Create Revolut payment order
  const revolutOrder = await createRevolutOrder(
    totalPrice,
    "GBP",
    `Item Booking - User: ${req.user.name}`
  );
  console.log("Revolut Order Created:", revolutOrder);
  const booking = await ItemBooking.create({
    amount: totalPrice,
    user: userId,
    items: cart.items,
    paymentOrderId: revolutOrder.id, // Store Revolut order ID for reference
    paymentStatus: "pending",
  });

  res.status(201).json(
    new ApiResponse(
      201,
      {
        booking,
        paymentOrder: revolutOrder,
      },
      "Booking Created with Payment Order"
    )
  );
});

// New direct booking function that doesn't rely on cart
export const createDirectBooking = asyncHandler(async (req, res) => {
  const { items } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    throw new ApiError(400, "Items array is required and cannot be empty");
  }

  const userId = req.user._id;

  // Validate item structure and fetch item details for pricing
  const validatedItems = await Promise.all(
    items.map(async (item) => {
      if (!item.item || !item.quantity || item.quantity <= 0) {
        throw new ApiError(
          400,
          "Each item must have valid item ID and quantity"
        );
      }

      // Ensure dates are provided for rental items
      if (!item.purchased && (!item.startDate || !item.endDate)) {
        throw new ApiError(
          400,
          "Start date and end date are required for rental items"
        );
      } // Validate dates for rental items
      if (!item.purchased && item.startDate && item.endDate) {
        const startDate = new Date(item.startDate);
        const endDate = new Date(item.endDate);

        if (startDate >= endDate) {
          throw new ApiError(
            400,
            "End date must be after start date for rental items"
          );
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
        endDate: item.endDate || null,
      };
    })
  );

  // Calculate total amount by fetching item details
  let totalAmount = 0;
  const itemsWithDetails = await Promise.all(
    validatedItems.map(async (validatedItem) => {
      const { Item } = await import("../models/item.model.js");
      const itemDetails = await Item.findById(validatedItem.item).select(
        "price rentalPrice purchase rent"
      );

      if (!itemDetails) {
        throw new ApiError(404, `Item with ID ${validatedItem.item} not found`);
      }

      // Check if item supports the requested booking type
      if (validatedItem.purchased && !itemDetails.purchase) {
        throw new ApiError(
          400,
          `Item ${validatedItem.item} is not available for purchase`
        );
      }

      if (!validatedItem.purchased && !itemDetails.rent) {
        throw new ApiError(
          400,
          `Item ${validatedItem.item} is not available for rent`
        );
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
        rentalPeriod: !validatedItem.purchased
          ? {
              startDate: validatedItem.startDate,
              endDate: validatedItem.endDate,
              days:
                validatedItem.startDate && validatedItem.endDate
                  ? Math.ceil(
                      (new Date(validatedItem.endDate) -
                        new Date(validatedItem.startDate)) /
                        (1000 * 60 * 60 * 24)
                    )
                  : null,
            }
          : undefined,
      };
    })
  );

  // Create Revolut payment order
  const revolutOrder = await createRevolutOrder(
    totalAmount,
    "GBP",
    `Direct Item Booking - User: ${req.user.name}`
  );

  const booking = await ItemBooking.create({
    amount: totalAmount,
    user: userId,
    items: itemsWithDetails,
    paymentOrderId: revolutOrder.id, // Store Revolut order ID for reference
    paymentStatus: "pending",
  });

  // Populate the created booking with item details
  const populatedBooking = await ItemBooking.findById(booking._id)
    .populate({
      path: "items.item",
      select: "name price rentalPrice images category",
    })
    .populate("user", "name email");

  res.status(201).json(
    new ApiResponse(
      201,
      {
        booking: populatedBooking,
        paymentOrder: revolutOrder,
      },
      "Direct Booking Created Successfully with Payment Order"
    )
  );
});

// Function to handle payment completion/webhook
export const handlePaymentCompletion = asyncHandler(async (req, res) => {
  const { orderId, status } = req.body;

  if (!orderId) {
    throw new ApiError(400, "Order ID is required");
  }

  // Find booking by payment order ID
  const booking = await ItemBooking.findOne({ paymentOrderId: orderId });

  if (!booking) {
    throw new ApiError(404, "Booking not found for this payment order");
  }

  // Update payment status based on Revolut webhook
  booking.paymentStatus = status; // e.g., 'completed', 'failed', 'cancelled'

  if (status === "completed") {
    booking.paymentCompletedAt = new Date();
  }

  await booking.save();

  res
    .status(200)
    .json(new ApiResponse(200, booking, "Payment status updated successfully"));
});

// Function to check payment status
export const getPaymentStatus = asyncHandler(async (req, res) => {
  const { bookingId } = req.params;

  const booking = await ItemBooking.findById(bookingId)
    .populate("user", "name email")
    .populate("items.item", "name price rentalPrice");

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
        amount: booking.amount,
        paymentCompletedAt: booking.paymentCompletedAt,
      },
      "Payment status retrieved successfully"
    )
  );
});

// Function to capture payment order
export const capturePaymentOrder = asyncHandler(async (req, res) => {
  const { orderId } = req.params;

  if (!orderId) {
    throw new ApiError(400, "Order ID is required");
  }

  try {
    // Call Revolut API to capture the payment
    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `https://sandbox-merchant.revolut.com/api/orders/${orderId}/capture`,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${process.env.REVOLUT_SECRET_API_KEY}`,
        "Revolut-Api-Version": "2024-09-01",
      },
    };

    const response = await axios(config);

    // Update booking status in database
    const booking = await ItemBooking.findOne({ paymentOrderId: orderId });

    if (booking) {
      booking.paymentStatus = "captured";
      booking.paymentCompletedAt = new Date();
      await booking.save();
    }

    res.status(200).json(
      new ApiResponse(
        200,
        {
          orderId: orderId,
          captureResponse: response.data,
          booking: booking,
        },
        "Payment captured successfully"
      )
    );
  } catch (error) {
    console.error(
      "Payment capture error:",
      error.response?.data || error.message
    );
    throw new ApiError(500, "Failed to capture payment");
  }
});

// Function to handle redirect from payment success
export const handlePaymentRedirect = asyncHandler(async (req, res) => {
  const { order_id, status } = req.query;

  if (!order_id) {
    throw new ApiError(400, "Order ID is required");
  }

  try {
    // Find the booking by payment order ID
    const booking = await ItemBooking.findOne({ paymentOrderId: order_id })
      .populate({
        path: "items.item",
        select: "name price rentalPrice images category",
      })
      .populate("user", "name email");

    if (!booking) {
      throw new ApiError(404, "Booking not found for this payment order");
    }

    // Update booking status based on redirect status
    if (status === "completed" || status === "success") {
      booking.paymentStatus = "completed";
      booking.paymentCompletedAt = new Date();
      await booking.save();

      // Clear user's cart after successful payment
      await Cart.findOneAndUpdate(
        { user: booking.user._id },
        { $set: { items: [] } }
      );
    }

    // Return booking details for the frontend to display
    res.status(200).json(
      new ApiResponse(
        200,
        {
          booking: booking,
          paymentStatus: booking.paymentStatus,
          redirectStatus: status,
        },
        "Payment redirect handled successfully"
      )
    );
  } catch (error) {
    console.error("Payment redirect handling error:", error);
    throw new ApiError(500, "Failed to handle payment redirect");
  }
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
    const booking = await ItemBooking.findOne({ paymentOrderId: orderId })
      .populate({
        path: "items.item",
        select: "name price rentalPrice images category",
      })
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
