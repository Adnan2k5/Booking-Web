import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";

export const getAllInstructors = asyncHandler(async (req, res) => {
    const { page, limit } = req.query;

    const instructors = await User.find({ role: "instructor" })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate({
            path: "instructor",
            populate: [{
                path: "adventure",
                select: "name",
            }, {
                path: "location",
                select: "name",
            }],
            select: "documentVerified certificate governmentId avgReview",
        })
        .select("email name phoneNumber profilePicture instructor");

    const total = await User.countDocuments({ role: "instructor" });
    const totalPages = Math.ceil(total / limit);

    res.status(200).json(
        new ApiResponse(200, "Instructors retrieved successfully", {
            instructors,
            total,
            totalPages,
        })
    );
});

export const deleteInstructor = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const instructor = await User.findById(id);
    if (!instructor) {
        throw new ApiError(404, "Instructor not found");
    }

    await User.findByIdAndDelete(id);

    res.status(200).json(
        new ApiResponse(200, "Instructor deleted successfully")
    );
});
