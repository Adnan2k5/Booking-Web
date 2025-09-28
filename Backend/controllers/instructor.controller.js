import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { Instructor } from "../models/instructor.model.js";

export const getAllInstructors = asyncHandler(async (req, res) => {
  const { page, limit = 10 } = req.query;

  const pageNumber = Math.max(1, Number.parseInt(page, 10) || 1);
  const pageSize = Math.max(1, Number.parseInt(limit, 10) || 10);

  const instructors = await User.find({ role: "instructor" })
    .skip((pageNumber - 1) * pageSize)
    .limit(pageSize)
    .populate({
      path: "instructor",
      populate: [
        {
          path: "adventure",
          select: "name",
        },
        {
          path: "location",
          select: "name",
        },
      ],
      select: "documentVerified certificate governmentId avgReview",
    })
    .select("email name phoneNumber profilePicture instructor");

  const total = await User.countDocuments({ role: "instructor" });
  const totalPages = Math.ceil(total / pageSize);

  res.status(200).json(
    new ApiResponse(200, {
      instructors,
      total,
      totalPages,
    }, "Instructors retrieved successfully")
  );
});

export const getInstructorById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const instructor = await User.find({ role: "instructor", instructor: id })
    .populate({
      path: "instructor",
      populate: [
        {
          path: "adventure",
          select: "name",
        },
        {
          path: "location",
          select: "name",
        },
      ],
      select: "documentVerified certificate governmentId avgReview",
    })
    .select("email name phoneNumber profilePicture instructor");

  res.status(200).json(
    new ApiResponse(200, {
      instructor,
    }, "Instructor retrieved successfully")
  );
});

export const deleteInstructor = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const instructor = await User.findById(id);
  if (!instructor) {
    throw new ApiError(404, "Instructor not found");
  }

  await User.findByIdAndDelete(id);

  res
    .status(200)
    .json(new ApiResponse(200, null, "Instructor deleted successfully"));
});

export const changeDocumentStatusById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const instructor = await Instructor.findById(id);
  if (!instructor) {
    throw new ApiError(404, "Instructor not found");
  }

  if (status !== "verified" && status !== "rejected") {
    throw new ApiError(400, "Invalid status");
  }
  instructor.documentVerified = status;
  await instructor.save();

  res.status(200).json(
    new ApiResponse(
      200,
      null,
      "Instructor document status updated successfully"
    )
  );
});
