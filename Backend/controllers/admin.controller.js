import { User } from "../models/user.model.js";
import { Admin } from "../models/admin.model.js";
import { ApiError } from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getAllAdmins = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  const admins = await User.find({ role: "admin" })
    .populate("admin", "adminRole")
    .skip(skip)
    .limit(parseInt(limit))
    .select("_id name email role admin createdAt");

  const total = await User.countDocuments({ role: "admin" });
  res.status(200).json({
    admins,
    total,
    page: parseInt(page),
    totalPages: Math.ceil(total / limit),
  });
});

export const createAdmin = asyncHandler(async (req, res) => {
  const { name, email, password, adminRoles } = req.body;
  if (!name || !email || !password || !adminRoles) {
    throw new ApiError(400, "All fields are required");
  }
  const existingAdmin = await User.findOne({ email: email });
  if (existingAdmin) {
    throw new ApiError(400, "Admin with this email already exists");
  }

  // Create Admin document first
  const adminDoc = await Admin.create({
    adminRole: Array.isArray(adminRoles) ? adminRoles : [adminRoles],
  });

  // Create User with reference to Admin
  const newAdmin = await User.create({
    name: name,
    email: email,
    verified: true,
    password: password,
    role: "admin",
    admin: adminDoc._id,
  });

  res
    .status(201)
    .json(new ApiResponse(201, newAdmin, "Admin created successfully"));
});

export const updateAdmin = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, email, adminRoles, password } = req.body;
  if (!name || !email || !adminRoles) {
    throw new ApiError(400, "Name, email, and admin roles are required");
  }
  const admin = await User.findById(id);
  if (!admin || admin.role !== "admin") {
    throw new ApiError(404, "Admin not found");
  }
  const updatedAdmin = await User.findByIdAndUpdate(
    id,
    {
      name: name,
      email: email,
      password: password,
    },
    { new: true }
  );
  if (!updatedAdmin) {
    throw new ApiError(500, "Failed to update admin");
  }
  const updatedAdminDoc = await Admin.findByIdAndUpdate(
    updatedAdmin.admin,
    {
      adminRole: Array.isArray(adminRoles) ? adminRoles : [adminRoles],
    },
    { new: true }
  );
  if (!updatedAdminDoc) {
    throw new ApiError(500, "Failed to update admin roles");
  }
  res
    .status(200)
    .json(new ApiResponse(200, updatedAdmin, "Admin updated successfully"));
});

export const deleteAdmin = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    throw new ApiError(400, "Admin ID is required");
  }

  const admin = await User.findById(id);
  if (!admin || admin.role !== "admin") {
    throw new ApiError(404, "Admin not found");
  }
  await User.findByIdAndDelete(id);
  await Admin.findByIdAndDelete(admin.admin);
  res.status(200).json(new ApiResponse(200, "Admin deleted successfully"));
});
