import { Booking } from "../models/booking.model.js";
import { Session } from "../models/session.model.js";
import { User } from "../models/user.model.js";
import { UserAdventureExperience } from "../models/userAdventureExperience.model.js";
import ApiResponse from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Create a new session booking
export const createSessionBooking = asyncHandler(async (req, res) => {
  const {
    session,
    amount,
    transactionId,
    groupMembers = [], // Array of user IDs for group bookings
    modeOfPayment = "card",
  } = req.body;

  // Validate required fields
  if (!session) {
    throw new ApiError(400, "Session ID is required");
  }

  if (!amount || amount <= 0) {
    throw new ApiError(400, "Valid amount is required");
  }

  // Check if session exists
  const sessionExists = await Session.findById(session).populate(
    "adventureId",
    "exp"
  );
  if (!sessionExists) {
    throw new ApiError(404, "Session not found");
  }

  // Check if session is active and not expired
  if (sessionExists.status !== "active") {
    throw new ApiError(400, "Session is not available for booking");
  }

  if (new Date() > new Date(sessionExists.expiresAt)) {
    throw new ApiError(400, "Session has expired");
  }

  // Check if session start time is in the future
  if (new Date() >= new Date(sessionExists.startTime)) {
    throw new ApiError(400, "Cannot book a session that has already started");
  }

  // Check Capacity
  const totalMembers = groupMembers.length + 1; // +1 for the user making the booking
  if (totalMembers > sessionExists.capacity) {
    throw new ApiError(
      400,
      `Cannot book more than ${sessionExists.capacity} members for this session`
    );
  }

  // Check if session already has a booking (assuming one booking per session)
  // if (sessionExists.booking) {
  //   throw new ApiError(400, "Session is already booked");
  // }

  // Check if user already has a booking for this session
  // const existingBooking = await Booking.findOne({
  //   user: req.user._id,
  //   session: session,
  //   status: { $ne: "cancelled" }
  // });

  // if (existingBooking) {
  //   throw new ApiError(400, "You have already booked this session");
  // }

  // Create the booking
  const booking = await Booking.create({
    user: req.user._id,
    groupMember: groupMembers,
    session,
    amount,
    transactionId,
    modeOfPayment,
  });

  groupMembers.push(req.user._id); // Include the user making the booking

  // Award adventure-specific experience to all group members
  const experiencePromises = groupMembers.map((userId) =>
    UserAdventureExperience.addExperience(
      userId,
      sessionExists.adventureId._id,
      sessionExists.adventureId.exp
    )
  );

  await Promise.all(experiencePromises);

  // Update session with booking reference
  await Session.findByIdAndUpdate(session, {
    booking: booking._id,
    $inc: { capacity: -totalMembers },
  });

  // Populate the booking with session and user details
  const populatedBooking = await Booking.findById(booking._id)
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
    .status(201)
    .json(
      new ApiResponse(
        201,
        populatedBooking,
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
