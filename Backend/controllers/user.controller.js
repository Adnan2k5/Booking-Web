import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";

export const getUser = asyncHandler(async (req, res) => {
  if (req.user.role === "instructor") {
    const user = await User.findById(req.user._id)
      .populate("instructor")
      .select("-password -refreshToken");
    return res.status(200).json(user);
  }
  return res.status(200).json(req.user);
});

// GET /users?search=&role=&page=&limit=
export const getUsers = asyncHandler(async (req, res) => {
  const { search = "", role, page = 1, limit = 10 } = req.query;
  const query = {};
  if (role && role !== "all") {
    query.role = role;
  }
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }
  const skip = (parseInt(page) - 1) * parseInt(limit);
  const users = await User.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit))
    .select("_id name email role bookings createdAt");
  const total = await User.countDocuments(query);
  res.status(200).json({
    users,
    total,
    page: parseInt(page),
    totalPages: Math.ceil(total / limit),
  });
});

export const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    throw new ApiError(400, "User ID is required");
  }

  const user = await User.findByIdAndDelete(id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  res.status(200).json(new ApiResponse(200, "User deleted successfully", user));
});

export const updateUser = asyncHandler(async (req, res) => {
  const updatedUser = await User.findByIdAndUpdate(req.params.id, {
    $set: req.body,
  });
  if (!updatedUser) {
    throw new ApiError(404, "User not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, updatedUser, "User updated successfully"));
});
