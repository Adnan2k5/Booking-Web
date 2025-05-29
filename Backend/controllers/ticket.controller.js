import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { Ticket } from "../models/ticket.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

// Create a new support ticket
const createTicket = asyncHandler(async (req, res) => {
  const { subject, description, category, priority } = req.body;

  if (!subject || !description || !category) {
    throw new ApiError(400, "All required fields must be provided");
  }

  // Handle file uploads if any
  let attachmentURLs = [];
  if (req.files && req.files.length > 0) {
    for (const file of req.files) {
      const uploadedFile = await uploadOnCloudinary(file.path);
      if (uploadedFile) {
        attachmentURLs.push(uploadedFile.url);
      }
    }
  }

  const ticket = await Ticket.create({
    user: req.user._id,
    subject,
    description,
    category,
    priority: priority || "medium",
    attachments: attachmentURLs,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, ticket, "Support ticket created successfully"));
});

// Get all tickets for current user
const getUserTickets = asyncHandler(async (req, res) => {
  const tickets = await Ticket.find({ user: req.user._id })
    .sort({ createdAt: -1 })
    .select("-responses.responder");

  return res
    .status(200)
    .json(new ApiResponse(200, tickets, "User tickets retrieved successfully"));
});

// Get a specific ticket by ID
const getTicketById = asyncHandler(async (req, res) => {
  const { ticketId } = req.params;

  const ticket = await Ticket.findById(ticketId).populate(
    "responses.responder",
    "name"
  );

  if (!ticket) {
    throw new ApiError(404, "Ticket not found");
  }

  // Check if user owns this ticket or is admin
  if (
    ticket.user.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    throw new ApiError(403, "You don't have permission to view this ticket");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, ticket, "Ticket retrieved successfully"));
});

// Add a response to a ticket
const addTicketResponse = asyncHandler(async (req, res) => {
  const { ticketId } = req.params;
  const { message } = req.body;

  if (!message) {
    throw new ApiError(400, "Response message is required");
  }

  const ticket = await Ticket.findById(ticketId);

  if (!ticket) {
    throw new ApiError(404, "Ticket not found");
  }

  // Check if user owns this ticket or is admin
  const isOwner = ticket.user.toString() === req.user._id.toString();
  const isAdmin = req.user.role === "admin";

  if (!isOwner && !isAdmin) {
    throw new ApiError(
      403,
      "You don't have permission to respond to this ticket"
    );
  }

  // Add the response
  ticket.responses.push({
    responder: req.user._id,
    message,
    isAdmin: isAdmin,
  });

  // If admin is responding, update status to in-progress if it's open
  if (isAdmin && ticket.status === "open") {
    ticket.status = "in-progress";
  }

  await ticket.save();

  return res
    .status(200)
    .json(new ApiResponse(200, ticket, "Re sponse added successfully"));
});

// Update ticket status
const updateTicketStatus = asyncHandler(async (req, res) => {
  const { ticketId } = req.params;
  const { status } = req.body;

  if (
    !status ||
    !["open", "in-progress", "resolved", "closed"].includes(status)
  ) {
    throw new ApiError(400, "Valid status is required");
  }

  const ticket = await Ticket.findById(ticketId);

  if (!ticket) {
    throw new ApiError(404, "Ticket not found");
  }

  // Only admins can change status, except users can close their own tickets
  if (
    req.user.role !== "admin" &&
    ticket.user.toString() !== req.user._id.toString()
  ) {
    throw new ApiError(
      403,
      "You don't have permission to update this ticket's status"
    );
  }

  ticket.status = status;
  await ticket.save();

  return res
    .status(200)
    .json(new ApiResponse(200, ticket, "Ticket status updated successfully"));
});

// Admin: Get all tickets (with filters)
const getAllTickets = asyncHandler(async (req, res) => {
  const { status, priority, category, page = 1, limit = 10 } = req.query;

  const filter = {};
  if (status) filter.status = status;
  if (priority) filter.priority = priority;
  if (category) filter.category = category;

  const tickets = await Ticket.find(filter)
    .sort({ updatedAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .populate("user", "name email");

  const totalTickets = await Ticket.countDocuments(filter);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        tickets,
        totalTickets,
        totalPages: Math.ceil(totalTickets / limit),
        currentPage: page,
      },
      "Tickets retrieved successfully"
    )
  );
});

export {
  createTicket,
  getUserTickets,
  getTicketById,
  addTicketResponse,
  updateTicketStatus,
  getAllTickets,
};
