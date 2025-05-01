import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";

export const getUser = asyncHandler(async (req, res) => {
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
            { email: { $regex: search, $options: "i" } }
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
        totalPages: Math.ceil(total / limit)
    });
});

