import { HotelBooking } from "../models/hotelBooking.model.js";
import { Hotel } from "../models/hotel.model.js";
import { User } from "../models/user.model.js";
import ApiResponse from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Create a new hotel booking
export const createHotelBooking = asyncHandler(async (req, res) => {
  const {
    hotels,
    amount,
    transactionId,
    modeOfPayment = "card",
  } = req.body;

  // Validate required fields
  if (!hotels || !Array.isArray(hotels) || hotels.length === 0) {
    throw new ApiError(400, "Hotels array is required and cannot be empty");
  }

  if (!amount || amount <= 0) {
    throw new ApiError(400, "Valid amount is required");
  }

  // Validate hotel data
  for (const hotelData of hotels) {
    const { hotel, quantity, startDate, endDate } = hotelData;

    if (!hotel) {
      throw new ApiError(400, "Hotel ID is required for each hotel");
    }

    if (!quantity || quantity < 1) {
      throw new ApiError(400, "Quantity must be at least 1");
    }

    if (!startDate || !endDate) {
      throw new ApiError(400, "Start date and end date are required");
    }

    if (new Date(startDate) >= new Date(endDate)) {
      throw new ApiError(400, "Start date must be before end date");
    }

    // Check if hotel exists
    const hotelExists = await Hotel.findById(hotel);
    if (!hotelExists) {
      throw new ApiError(404, `Hotel with ID ${hotel} not found`);
    }

    // Check if hotel is approved
    if (hotelExists.verified !== "approved") {
      throw new ApiError(400, `Hotel ${hotelExists.name} is not approved for booking`);
    }
  }

  // Create the booking
  const booking = await HotelBooking.create({
    user: req.user._id,
    hotels,
    amount,
    transactionId,
    modeOfPayment,
  });

  // Populate the booking with hotel and user details
  const populatedBooking = await HotelBooking.findById(booking._id)
    .populate("user", "name email phoneNumber")
    .populate("hotels.hotel", "name location pricePerNight rating");

  return res.status(201).json(
    new ApiResponse(201, populatedBooking, "Hotel booking created successfully")
  );
});

// Get all hotel bookings with optional filtering
export const getAllHotelBookings = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    status,
    modeOfPayment,
    search,
    sortBy = "createdAt",
    sortOrder = "desc"
  } = req.query;

  const skip = (parseInt(page) - 1) * parseInt(limit);
  
  // Build query object
  let query = {};

  if (status) {
    query.status = status;
  }

  if (modeOfPayment) {
    query.modeOfPayment = modeOfPayment;
  }

  // Search functionality
  if (search) {
    const users = await User.find({
      $or: [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } }
      ]
    }).select("_id");

    const userIds = users.map(user => user._id);
    query.user = { $in: userIds };
  }

  // Sorting
  const sortOptions = {};
  sortOptions[sortBy] = sortOrder === "asc" ? 1 : -1;

  const bookings = await HotelBooking.find(query)
    .sort(sortOptions)
    .skip(skip)
    .limit(parseInt(limit))
    .populate("user", "name email phoneNumber")
    .populate("hotels.hotel", "name location pricePerNight rating medias");

  const total = await HotelBooking.countDocuments(query);

  return res.status(200).json(
    new ApiResponse(200, {
      bookings,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
    }, "Hotel bookings retrieved successfully")
  );
});

// Get hotel bookings by user ID
export const getHotelBookingsByUserId = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const {
    page = 1,
    limit = 10,
    status,
    sortBy = "createdAt",
    sortOrder = "desc"
  } = req.query;

  // Validate user ID
  if (!userId) {
    throw new ApiError(400, "User ID is required");
  }

  // Check if user exists
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);
  
  // Build query object
  let query = { user: userId };

  if (status) {
    query.status = status;
  }

  // Sorting
  const sortOptions = {};
  sortOptions[sortBy] = sortOrder === "asc" ? 1 : -1;

  const bookings = await HotelBooking.find(query)
    .sort(sortOptions)
    .skip(skip)
    .limit(parseInt(limit))
    .populate("user", "name email phoneNumber")
    .populate("hotels.hotel", "name location pricePerNight rating medias");

  const total = await HotelBooking.countDocuments(query);

  return res.status(200).json(
    new ApiResponse(200, {
      bookings,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
    }, "User hotel bookings retrieved successfully")
  );
});

// Get current user's hotel bookings
export const getMyHotelBookings = asyncHandler(async (req, res) => {
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

  const bookings = await HotelBooking.find(query)
    .sort(sortOptions)
    .skip(skip)
    .limit(parseInt(limit))
    .populate("user", "name email phoneNumber")
    .populate("hotels.hotel", "name location pricePerNight rating medias");

  const total = await HotelBooking.countDocuments(query);

  return res.status(200).json(
    new ApiResponse(200, {
      bookings,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
    }, "My hotel bookings retrieved successfully")
  );
});

// Get a specific hotel booking by ID
export const getHotelBookingById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new ApiError(400, "Booking ID is required");
  }

  const booking = await HotelBooking.findById(id)
    .populate("user", "name email phoneNumber")
    .populate("hotels.hotel", "name location pricePerNight rating medias amenities");

  if (!booking) {
    throw new ApiError(404, "Hotel booking not found");
  }

  return res.status(200).json(
    new ApiResponse(200, booking, "Hotel booking retrieved successfully")
  );
});

// Update hotel booking status
export const updateHotelBookingStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!id) {
    throw new ApiError(400, "Booking ID is required");
  }

  if (!status || !["pending", "confirmed", "cancelled"].includes(status)) {
    throw new ApiError(400, "Valid status is required (pending, confirmed, cancelled)");
  }

  const booking = await HotelBooking.findById(id);
  if (!booking) {
    throw new ApiError(404, "Hotel booking not found");
  }

  booking.status = status;
  await booking.save();

  const updatedBooking = await HotelBooking.findById(id)
    .populate("user", "name email phoneNumber")
    .populate("hotels.hotel", "name location pricePerNight rating");

  return res.status(200).json(
    new ApiResponse(200, updatedBooking, "Hotel booking status updated successfully")
  );
});

// Cancel a hotel booking (user can only cancel their own bookings)
export const cancelHotelBooking = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new ApiError(400, "Booking ID is required");
  }

  const booking = await HotelBooking.findById(id);
  if (!booking) {
    throw new ApiError(404, "Hotel booking not found");
  }

  // Check if user owns this booking
  if (booking.user.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You can only cancel your own bookings");
  }

  // Check if booking can be cancelled
  if (booking.status === "cancelled") {
    throw new ApiError(400, "Booking is already cancelled");
  }

  booking.status = "cancelled";
  await booking.save();

  const updatedBooking = await HotelBooking.findById(id)
    .populate("user", "name email phoneNumber")
    .populate("hotels.hotel", "name location pricePerNight rating");

  return res.status(200).json(
    new ApiResponse(200, updatedBooking, "Hotel booking cancelled successfully")
  );
});

// Delete a hotel booking (admin only)
export const deleteHotelBooking = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new ApiError(400, "Booking ID is required");
  }

  const booking = await HotelBooking.findById(id);
  if (!booking) {
    throw new ApiError(404, "Hotel booking not found");
  }

  await HotelBooking.findByIdAndDelete(id);

  return res.status(200).json(
    new ApiResponse(200, null, "Hotel booking deleted successfully")
  );
});