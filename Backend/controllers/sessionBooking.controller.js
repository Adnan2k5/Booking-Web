import { Booking } from "../models/booking.model.js";
import { Session } from "../models/session.model.js";
import { User } from "../models/user.model.js";
import ApiResponse from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Item } from "../models/item.model.js";
import { ItemBooking } from "../models/itemBooking.model.js";
import { HotelBooking } from "../models/hotelBooking.model.js";
import { createRevolutOrder } from "../utils/revolut.js";
import { Hotel } from "../models/hotel.model.js";

// Create a new session booking
export const createSessionBooking = asyncHandler(async (req, res) => {
  const { sessionBooking, itemBooking, hotelBooking } = req.body;

  if (!sessionBooking) {
    throw new ApiError(400, "Session booking details are required");
  }

  const {
    session,
    groupMembers = [],
  } = sessionBooking;

  // Validate required fields
  if (!session) {
    throw new ApiError(400, "Session ID, User ID, and Mode of Payment are required");
  }

  // Check if session exists
  const sessionData = await Session.findById(session);
  if (!sessionData) {
    throw new ApiError(404, "Session not found");
  }

  let totalPrice = sessionData.price * (groupMembers.length + 1);

  // Check if user is booking for themselves or as a group
  const userId = req.user._id;
  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Create booking object
  const booking = await Booking.create({
    user: userId,
    session: session,
    groupMember: groupMembers,
    totalPrice,
    modeOfPayment: sessionBooking.modeOfPayment || "revolut",
    status: "pending",
  });

  // Add booking reference to session
  await Session.findByIdAndUpdate(session, {
    booking: booking._id,
    $inc: { capacity: -groupMembers.length - 1 }, // Decrease session capacity
  });

  const { items } = itemBooking;

  if (items && items.length > 0) {
    let itemPrice = 0;

    for (const item of items) {
      if (!item.item || !item.quantity) {
        throw new ApiError(400, "Item ID and quantity are required for each item");
      }

      const itemData = await Item.findById(item.item);
      if (!itemData) {
        throw new ApiError(404, `Item with ID ${item.item} not found`);
      }

      if (item.purchased) {
        itemPrice += itemData.price * item.quantity;
      } else {
        const days = Math.ceil((new Date(item.endDate) - new Date(item.startDate)) / (1000 * 60 * 60 * 24));
        itemPrice += itemData.rentalPrice * item.quantity * days;
      }
    }

    totalPrice += itemPrice;

    const itemBookingData = await ItemBooking.create({
      user: userId,
      items: items.map((item) => ({
        item: item.item,
        quantity: item.quantity,
        rentalPeriod: {
          startDate: item.startDate,
          endDate: item.endDate,
          days: item.purchased ? null : Math.ceil((new Date(item.endDate) - new Date(item.startDate)) / (1000 * 60 * 60 * 24)),
        },
        purchase: item.purchased || false,
      })),
      totalPrice: itemPrice,
      modeOfPayment: sessionBooking.modeOfPayment || "revolut",
    });
  }


  // If hotel booking is provided, process it
  const hotels = hotelBooking?.hotels[0] || null;
  if (hotels) {
    if (!hotels.hotel || !hotels.checkInDate || !hotels.checkOutDate) {
      throw new ApiError(400, "Hotel ID, check-in date, and check-out date are required");
    }

    // Calculate nights between two dates
    const nightsBetween = (startDate, endDate) => {
      const difference = endDate.getTime() - startDate.getTime();
      return Math.ceil(difference / (1000 * 3600 * 24));
    };

    const hotel = await Hotel.findById(hotels.hotel);

    const hotelPrice = hotel.price * nightsBetween(
      new Date(hotels.checkInDate),
      new Date(hotels.checkOutDate)
    );

    await HotelBooking.create({
      user: userId,
      hotel: hotels.hotel,
      numberOfRooms: 1,
      guests: 1,
      checkInDate: hotels.checkInDate,
      checkOutDate: hotels.checkOutDate,
      amount: hotelPrice,
      modeOfPayment: sessionBooking.modeOfPayment || "revolut",
    });

    totalPrice += hotelPrice;
  }

  const data = await createRevolutOrder(totalPrice, "GBP", "Session Booking Payment");

  return res.status(201).json(
    new ApiResponse(
      201,
      {
        booking,
        totalPrice,
        paymentUrl: data.checkout_url, // Assuming createRevolutOrder returns a payment URL
      },
      "Session booking created successfully"
    )
  );
});

// Get all session bookings with optional filtering
export const getAllSessionBookings = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    status,
    modeOfPayment,
    search,
    sortBy = "createdAt",
    sortOrder = "desc",
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

  // Search functionality - search by user name/email
  if (search) {
    const users = await User.find({
      $or: [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ],
    }).select("_id");

    const userIds = users.map((user) => user._id);
    query.user = { $in: userIds };
  }

  // Sorting
  const sortOptions = {};
  sortOptions[sortBy] = sortOrder === "asc" ? 1 : -1;

  const bookings = await Booking.find(query)
    .sort(sortOptions)
    .skip(skip)
    .limit(parseInt(limit))
    .populate("user", "name email phoneNumber")
    .populate({
      path: "session",
      populate: [
        {
          path: "adventureId",
          select: "title description category difficulty",
        },
        { path: "instructorId", select: "name email phoneNumber" },
        { path: "location", select: "name address city state country" },
      ],
    });

  const total = await Booking.countDocuments(query);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        bookings,
        total,
        page: parseInt(page),
        totalPages: Math.ceil(total / limit),
      },
      "Session bookings retrieved successfully"
    )
  );
});

// Get session bookings by user ID
export const getSessionBookingsByUserId = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const {
    page = 1,
    limit = 10,
    status,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = req.query;

  // Validate user ID
  if (!userId) {
    throw new ApiError(400, "User ID is required");
  }

  // Check if user exists
  const userExists = await User.findById(userId);
  if (!userExists) {
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

  const bookings = await Booking.find(query)
    .sort(sortOptions)
    .skip(skip)
    .limit(parseInt(limit))
    .populate("user", "name email phoneNumber")
    .populate({
      path: "session",
      populate: [
        {
          path: "adventureId",
          select: "title description category difficulty",
        },
        { path: "instructorId", select: "name email phoneNumber" },
        { path: "location", select: "name address city state country" },
      ],
    });

  const total = await Booking.countDocuments(query);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        bookings,
        total,
        page: parseInt(page),
        totalPages: Math.ceil(total / limit),
      },
      "User session bookings retrieved successfully"
    )
  );
});

// Get current user's session bookings
export const getCurrentUserSessionBookings = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    status,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = req.query;

  const skip = (parseInt(page) - 1) * parseInt(limit);

  // Build query object
  let query = { user: req.user._id, groupMember: { $ne: req.user._id } };

  // if (status) {
  //   query.status = status;
  // }

  // Sorting
  const sortOptions = {};
  sortOptions[sortBy] = sortOrder === "asc" ? 1 : -1;

  const bookings = await Booking.find(query)
    .sort(sortOptions)
    .skip(skip)
    .limit(parseInt(limit))
    .populate("user", "name email phoneNumber")
    .populate({
      path: "session",
      populate: [
        {
          path: "adventureId",
          select: "title description category thumbnail medias",
        },
        { path: "instructorId", select: "name email phoneNumber" },
        { path: "location", select: "name address city state country" },
      ],
    });

  const total = await Booking.countDocuments(query);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        bookings,
        total,
        page: parseInt(page),
        totalPages: Math.ceil(total / limit),
      },
      "Your session bookings retrieved successfully"
    )
  );
});

// Get a specific session booking by ID
export const getSessionBookingById = asyncHandler(async (req, res) => {
  const { bookingId } = req.params;

  if (!bookingId) {
    throw new ApiError(400, "Booking ID is required");
  }

  const booking = await Booking.findById(bookingId)
    .populate("user", "name email phoneNumber")
    .populate({
      path: "session",
      populate: [
        {
          path: "adventureId",
          select: "title description category difficulty",
        },
        { path: "instructorId", select: "name email phoneNumber" },
        { path: "location", select: "name address city state country" },
      ],
    });

  if (!booking) {
    throw new ApiError(404, "Session booking not found");
  }

  // Check if user is authorized to view this booking (user themselves or admin)
  if (
    req.user.role !== "admin" &&
    booking.user._id.toString() !== req.user._id.toString()
  ) {
    throw new ApiError(403, "Not authorized to access this booking");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, booking, "Session booking retrieved successfully")
    );
});

// Update session booking status
export const updateSessionBookingStatus = asyncHandler(async (req, res) => {
  const { bookingId } = req.params;
  const { status } = req.body;

  if (!bookingId) {
    throw new ApiError(400, "Booking ID is required");
  }

  if (!status) {
    throw new ApiError(400, "Status is required");
  }

  const validStatuses = ["pending", "confirmed", "cancelled"];
  if (!validStatuses.includes(status)) {
    throw new ApiError(
      400,
      "Invalid status. Must be one of: " + validStatuses.join(", ")
    );
  }

  const booking = await Booking.findById(bookingId);
  if (!booking) {
    throw new ApiError(404, "Session booking not found");
  }

  // Check if user is authorized to update this booking
  if (
    req.user.role !== "admin" &&
    booking.user.toString() !== req.user._id.toString()
  ) {
    throw new ApiError(403, "Not authorized to update this booking");
  }

  // If cancelling, remove booking reference from session
  if (status === "cancelled" && booking.status !== "cancelled") {
    await Session.findByIdAndUpdate(booking.session, {
      $unset: { booking: 1 },
    });
  }

  // If confirming a previously cancelled booking, add booking reference back to session
  if (status === "confirmed" && booking.status === "cancelled") {
    // Check if session already has another booking
    const session = await Session.findById(booking.session);
    if (session.booking && session.booking.toString() !== bookingId) {
      throw new ApiError(400, "Session is already booked by another user");
    }
    await Session.findByIdAndUpdate(booking.session, { booking: bookingId });
  }

  const updatedBooking = await Booking.findByIdAndUpdate(
    bookingId,
    { status },
    { new: true }
  )
    .populate("user", "name email phoneNumber")
    .populate({
      path: "session",
      populate: [
        {
          path: "adventureId",
          select: "title description category difficulty",
        },
        { path: "instructorId", select: "name email phoneNumber" },
        { path: "location", select: "name address city state country" },
      ],
    });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedBooking,
        "Session booking status updated successfully"
      )
    );
});

// Cancel session booking (user can cancel their own booking)
export const cancelSessionBooking = asyncHandler(async (req, res) => {
  const { bookingId } = req.params;

  if (!bookingId) {
    throw new ApiError(400, "Booking ID is required");
  }

  const booking = await Booking.findById(bookingId);
  if (!booking) {
    throw new ApiError(404, "Session booking not found");
  }

  // Check if user is authorized to cancel this booking
  if (
    req.user.role !== "admin" &&
    booking.user.toString() !== req.user._id.toString()
  ) {
    throw new ApiError(403, "Not authorized to cancel this booking");
  }

  // Check if booking can be cancelled
  if (booking.status === "cancelled") {
    throw new ApiError(400, "Booking is already cancelled");
  }

  // Check if session has already started (optional business rule)
  const session = await Session.findById(booking.session);
  if (new Date() >= new Date(session.startTime)) {
    throw new ApiError(
      400,
      "Cannot cancel a booking for a session that has already started"
    );
  }

  // Update booking status to cancelled
  const updatedBooking = await Booking.findByIdAndUpdate(
    bookingId,
    { status: "cancelled" },
    { new: true }
  )
    .populate("user", "name email phoneNumber")
    .populate({
      path: "session",
      populate: [
        {
          path: "adventureId",
          select: "title description category difficulty",
        },
        { path: "instructorId", select: "name email phoneNumber" },
        { path: "location", select: "name address city state country" },
      ],
    });

  // Remove booking reference from session
  await Session.findByIdAndUpdate(booking.session, { $unset: { booking: 1 } });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedBooking,
        "Session booking cancelled successfully"
      )
    );
});

// Delete session booking (admin only)
export const deleteSessionBooking = asyncHandler(async (req, res) => {
  const { bookingId } = req.params;

  if (!bookingId) {
    throw new ApiError(400, "Booking ID is required");
  }

  const booking = await Booking.findById(bookingId);
  if (!booking) {
    throw new ApiError(404, "Session booking not found");
  }

  // Remove booking reference from session
  await Session.findByIdAndUpdate(booking.session, { $unset: { booking: 1 } });

  // Delete the booking
  await Booking.findByIdAndDelete(bookingId);

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Session booking deleted successfully"));
});

// Get session bookings by session ID
export const getSessionBookingsBySessionId = asyncHandler(async (req, res) => {
  const { sessionId } = req.params;
  const {
    page = 1,
    limit = 10,
    status,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = req.query;

  // Validate session ID
  if (!sessionId) {
    throw new ApiError(400, "Session ID is required");
  }

  // Check if session exists
  const sessionExists = await Session.findById(sessionId);
  if (!sessionExists) {
    throw new ApiError(404, "Session not found");
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);

  // Build query object
  let query = { session: sessionId };

  if (status) {
    query.status = status;
  }

  // Sorting
  const sortOptions = {};
  sortOptions[sortBy] = sortOrder === "asc" ? 1 : -1;

  const bookings = await Booking.find(query)
    .sort(sortOptions)
    .skip(skip)
    .limit(parseInt(limit))
    .populate("user", "name email phoneNumber")
    .populate("groupMember", "name email phoneNumber")
    .populate({
      path: "session",
      populate: [
        {
          path: "adventureId",
          select: "title description category difficulty",
        },
        { path: "instructorId", select: "name email phoneNumber" },
        { path: "location", select: "name address city state country" },
      ],
    });

  const total = await Booking.countDocuments(query);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        bookings,
        total,
        page: parseInt(page),
        totalPages: Math.ceil(total / limit),
      },
      "Session bookings retrieved successfully"
    )
  );
});
