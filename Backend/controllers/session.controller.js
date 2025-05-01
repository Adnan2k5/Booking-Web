// Session Controller
import { Session } from "../models/session.model.js";
import { Adventure } from "../models/adventure.model.js";
import { Instructor } from "../models/instructor.model.js";
import { ApiError } from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";

// Create a new session
export const createSession = asyncHandler(async (req, res, next) => {
    const { days, status, expiresAt, startTime, capacity, adventureId, instructorId, location } = req.body;

    // Validate required fields
    if (!days || !Array.isArray(days) || days.length === 0) {
        throw new ApiError(400, "At least one day is required");
    }
    if (!expiresAt || !startTime) {
        throw new ApiError(400, "Both startTime and expiresAt are required");
    }
    if (!capacity || capacity <= 0) {
        throw new ApiError(400, "Capacity must be a positive number");
    }
    if (!adventureId) {
        throw new ApiError(400, "adventureId is required");
    }
    if (!instructorId) {
        throw new ApiError(400, "instructorId is required");
    }
    if (!location) {
        throw new ApiError(400, "Location is required");
    }

    // Logical checks
    if (new Date(startTime) >= new Date(expiresAt)) {
        throw new ApiError(400, "startTime must be before expiresAt");
    }

    // Check referenced adventure and instructor exist
    const adventure = await Adventure.findById(adventureId);
    if (!adventure) {
        throw new ApiError(404, "Adventure not found");
    }
    const instructor = await Instructor.findById(instructorId);
    if (!instructor) {
        throw new ApiError(404, "Instructor not found");
    }

    // Prevent duplicate session (same adventure, instructor, and overlapping time)
    const duplicate = await Session.findOne({
        adventureId,
        instructorId,
        $or: [
            { startTime: { $lte: expiresAt }, expiresAt: { $gte: startTime } }
        ]
    });
    if (duplicate) {
        throw new ApiError(409, "A session with overlapping time already exists for this adventure and instructor");
    }

    const session = new Session(req.body);
    await session.save();
    res.status(201).json(session);
});

// Update an existing session
export const updateSession = asyncHandler(async (req, res, next) => {
    const { days, status, expiresAt, startTime, capacity, adventureId, instructorId, location } = req.body;
    const session = await Session.findById(req.params.id);
    if (!session) {
        throw new ApiError(404, "Session not found");
    }
    // Optional: Prevent update if session is completed/cancelled/expired
    if (["completed", "cancelled", "expired"].includes(session.status)) {
        throw new ApiError(400, `Cannot update a session with status: ${session.status}`);
    }
    // Validate fields if provided
    if (days && (!Array.isArray(days) || days.length === 0)) {
        throw new ApiError(400, "At least one day is required");
    }
    if (capacity !== undefined && capacity <= 0) {
        throw new ApiError(400, "Capacity must be a positive number");
    }
    if (startTime && expiresAt && new Date(startTime) >= new Date(expiresAt)) {
        throw new ApiError(400, "startTime must be before expiresAt");
    }
    // Check referenced adventure and instructor if changed
    if (adventureId && !(await Adventure.findById(adventureId))) {
        throw new ApiError(404, "Adventure not found");
    }
    if (instructorId && !(await Instructor.findById(instructorId))) {
        throw new ApiError(404, "Instructor not found");
    }
    // Prevent duplicate session (same adventure, instructor, and overlapping time)
    if ((adventureId || instructorId || startTime || expiresAt)) {
        const duplicate = await Session.findOne({
            _id: { $ne: session._id },
            adventureId: adventureId || session.adventureId,
            instructorId: instructorId || session.instructorId,
            $or: [
                { startTime: { $lte: expiresAt || session.expiresAt }, expiresAt: { $gte: startTime || session.startTime } }
            ]
        });
        if (duplicate) {
            throw new ApiError(409, "A session with overlapping time already exists for this adventure and instructor");
        }
    }
    Object.assign(session, req.body);
    await session.save();
    res.json(session);
});

// Delete a session
export const deleteSession = asyncHandler(async (req, res, next) => {
    const session = await Session.findById(req.params.id);
    if (!session) {
        throw new ApiError(404, "Session not found");
    }
    // Prevent deletion if session is completed or has a booking
    if (["completed", "cancelled", "expired"].includes(session.status)) {
        throw new ApiError(400, `Cannot delete a session with status: ${session.status}`);
    }
    if (session.booking) {
        throw new ApiError(400, "Cannot delete a session that has a booking");
    }
    await session.deleteOne();
    res.json({ message: "Session deleted" });
});
