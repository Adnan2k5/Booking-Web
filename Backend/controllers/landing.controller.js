import { Event } from "../models/events.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
export const createEvents = asyncHandler(async (req, res, next) => {
  const { title, description, date, time, location } = req.body;
  if (!title || !description || !date || !time || !location) {
    return res.status(400).json({ message: "All fields are required" });
  }

  let medias = [];
  if (req.files && req.files.medias) {
    const mediaFiles = Array.isArray(req.files.medias)
      ? req.files.medias
      : [req.files.medias];

    for (const file of mediaFiles) {
      const uploaded = await uploadOnCloudinary(file.path);
      if (uploaded && uploaded.url) {
        medias.push(uploaded.url);
      }
    }
  }

  const event = new Event({
    title,
    description,
    date,
    time,
    location,
    medias,
  });
  await event.save();
  res.status(201).json({
    success: true,
    message: "Event created successfully",
    data: event,
  });
});

export const getAllEvents = asyncHandler(async (req, res, next) => {
  const { search = "", page = 1, limit = 10 } = req.query;
  const query = {};
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }
  const skip = (parseInt(page) - 1) * parseInt(limit);
  const events = await Event.find(query)
    .sort({ date: 1 })
    .skip(skip)
    .limit(parseInt(limit));
  if (!events || events.length === 0) {
    return res.status(200).json({ message: "No events found" });
  }
  res.status(200).json({
    success: true,
    data: events,
    total: events.length,
  });
});

export const getEventById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const event = await Event.findById(id);
  if (!event) {
    return res.status(404).json({ message: "Event not found" });
  }
  res.status(200).json({
    success: true,
    message: "Event retrieved successfully",
    data: event,
  });
});

export const updateEvent = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { title, description, date, time, location } = req.body;

  let medias = [];
  if (req.files && req.files.medias) {
    const mediaFiles = Array.isArray(req.files.medias)
      ? req.files.medias
      : [req.files.medias];

    for (const file of mediaFiles) {
      const uploaded = await uploadOnCloudinary(file.path);
      if (uploaded && uploaded.url) {
        medias.push(uploaded.url);
      }
    }
  }

  const updateData = {
    title,
    description,
    date,
    time,
    location,
    medias,
  };

  const event = await Event.findByIdAndUpdate(id, updateData, { new: true });
  if (!event) {
    return res.status(404).json({ message: "Event not found" });
  }
  res.status(200).json({
    success: true,
    message: "Event updated successfully",
    data: event,
  });
});

export const deleteEvent = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const event = await Event.findByIdAndDelete(id);
  if (!event) {
    return res.status(404).json({ message: "Event not found" });
  }
  res.status(200).json({ message: "Event deleted successfully" });
});
