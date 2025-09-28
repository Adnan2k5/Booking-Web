import { User } from "../models/user.model.js";
import { Admin } from "../models/admin.model.js";
import { Booking } from "../models/booking.model.js";
import { EventBooking } from "../models/eventBooking.model.js";
import { Adventure } from "../models/adventure.model.js";
import { ApiError } from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const percentageChange = (current = 0, previous = 0) => {
  if (previous === 0) {
    return current > 0 ? 100 : 0;
  }
  const diff = ((current - previous) / previous) * 100;
  return Number(diff.toFixed(1));
};

const resolvePeriods = (range = "month") => {
  const now = new Date();
  let currentStart;
  switch (range) {
    case "day":
      currentStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      break;
    case "week": {
      currentStart = new Date(now);
      currentStart.setHours(0, 0, 0, 0);
      currentStart.setDate(currentStart.getDate() - 6);
      break;
    }
    case "year":
      currentStart = new Date(now.getFullYear(), 0, 1);
      break;
    case "month":
    default:
      currentStart = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
  }

  const previousStart = new Date(currentStart);

  if (range === "day") {
    previousStart.setDate(previousStart.getDate() - 1);
  } else if (range === "week") {
    previousStart.setDate(previousStart.getDate() - 7);
  } else if (range === "month") {
    previousStart.setMonth(previousStart.getMonth() - 1);
  } else {
    previousStart.setFullYear(previousStart.getFullYear() - 1);
  }

  const previousEnd = new Date(currentStart.getTime() - 1);

  return {
    now,
    currentStart,
    previousStart,
    previousEnd,
  };
};

const buildMatch = (base, start, end) => {
  const match = { ...base };
  if (start || end) {
    match.createdAt = {};
    if (start) {
      match.createdAt.$gte = start;
    }
    if (end) {
      match.createdAt.$lte = end;
    }
  }
  return match;
};

const summariseAggregate = (result = []) => ({
  totalAmount: result[0]?.totalAmount ?? 0,
  count: result[0]?.count ?? 0,
});

const summaryPipeline = (match) => [
  { $match: match },
  {
    $group: {
      _id: null,
      totalAmount: { $sum: { $ifNull: ["$amount", 0] } },
      count: { $sum: 1 },
    },
  },
];

export const getDashboardStats = asyncHandler(async (req, res) => {
  const { range = "month" } = req.query;
  const { now, currentStart, previousStart, previousEnd } = resolvePeriods(range);

  const bookingMatch = { status: { $ne: "cancelled" } };
  const eventMatch = {
    status: { $ne: "cancelled" },
    paymentStatus: "completed",
  };

  const monthsLookbackStart = new Date(now.getFullYear(), now.getMonth() - 11, 1);

  const [
    bookingTotals,
    eventTotals,
    bookingCurrent,
    bookingPrevious,
    eventCurrent,
    eventPrevious,
    totalUsers,
    usersCurrent,
    usersPrevious,
    totalAdventures,
    adventuresCurrent,
    adventuresPrevious,
    topAdventuresRaw,
    bookingMonthly,
    eventMonthly,
    recentAdventureBookings,
    recentEventBookings,
  ] = await Promise.all([
    Booking.aggregate(summaryPipeline(bookingMatch)),
    EventBooking.aggregate(summaryPipeline(eventMatch)),
    Booking.aggregate(summaryPipeline(buildMatch(bookingMatch, currentStart))),
    Booking.aggregate(summaryPipeline(buildMatch(bookingMatch, previousStart, previousEnd))),
    EventBooking.aggregate(summaryPipeline(buildMatch(eventMatch, currentStart))),
    EventBooking.aggregate(summaryPipeline(buildMatch(eventMatch, previousStart, previousEnd))),
    User.countDocuments({ role: { $in: ["user", "instructor", "hotel"] } }),
    User.countDocuments({
      role: { $in: ["user", "instructor", "hotel"] },
      createdAt: { $gte: currentStart },
    }),
    User.countDocuments({
      role: { $in: ["user", "instructor", "hotel"] },
      createdAt: { $gte: previousStart, $lte: previousEnd },
    }),
    Adventure.countDocuments(),
    Adventure.countDocuments({ createdAt: { $gte: currentStart } }),
    Adventure.countDocuments({ createdAt: { $gte: previousStart, $lte: previousEnd } }),
    Booking.aggregate([
      { $match: bookingMatch },
      {
        $lookup: {
          from: "sessions",
          localField: "session",
          foreignField: "_id",
          as: "session",
        },
      },
      { $unwind: "$session" },
      {
        $lookup: {
          from: "adventures",
          localField: "session.adventureId",
          foreignField: "_id",
          as: "adventure",
        },
      },
      { $unwind: "$adventure" },
      {
        $group: {
          _id: "$adventure._id",
          name: { $first: "$adventure.name" },
          bookings: { $sum: 1 },
          revenue: { $sum: { $ifNull: ["$amount", 0] } },
        },
      },
      { $sort: { bookings: -1 } },
      { $limit: 5 },
    ]),
    Booking.aggregate([
      { $match: buildMatch(bookingMatch, monthsLookbackStart) },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          revenue: { $sum: { $ifNull: ["$amount", 0] } },
        },
      },
    ]),
    EventBooking.aggregate([
      { $match: buildMatch(eventMatch, monthsLookbackStart) },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          revenue: { $sum: { $ifNull: ["$amount", 0] } },
        },
      },
    ]),
    Booking.find(bookingMatch)
      .sort({ createdAt: -1 })
      .limit(5)
      .populate({ path: "user", select: "name" })
      .populate({
        path: "session",
        populate: { path: "adventureId", select: "name" },
      })
      .select("amount createdAt"),
    EventBooking.find(eventMatch)
      .sort({ createdAt: -1 })
      .limit(5)
      .populate({ path: "user", select: "name" })
      .populate({ path: "event", select: "title" })
      .select("amount createdAt"),
  ]);

  const bookingTotalsSummary = summariseAggregate(bookingTotals);
  const eventTotalsSummary = summariseAggregate(eventTotals);
  const bookingCurrentSummary = summariseAggregate(bookingCurrent);
  const bookingPreviousSummary = summariseAggregate(bookingPrevious);
  const eventCurrentSummary = summariseAggregate(eventCurrent);
  const eventPreviousSummary = summariseAggregate(eventPrevious);

  const totalRevenue = bookingTotalsSummary.totalAmount + eventTotalsSummary.totalAmount;
  const totalBookings = bookingTotalsSummary.count + eventTotalsSummary.count;

  const revenueCurrent = bookingCurrentSummary.totalAmount + eventCurrentSummary.totalAmount;
  const revenuePrevious = bookingPreviousSummary.totalAmount + eventPreviousSummary.totalAmount;
  const bookingsCurrentCount = bookingCurrentSummary.count + eventCurrentSummary.count;
  const bookingsPreviousCount = bookingPreviousSummary.count + eventPreviousSummary.count;

  const revenueIncrease = percentageChange(revenueCurrent, revenuePrevious);
  const userIncrease = percentageChange(usersCurrent, usersPrevious);
  const adventureIncrease = percentageChange(adventuresCurrent, adventuresPrevious);
  const bookingIncrease = percentageChange(bookingsCurrentCount, bookingsPreviousCount);

  const monthlyRevenueMap = new Map();
  [...bookingMonthly, ...eventMonthly].forEach(({ _id, revenue }) => {
    const key = `${_id.year}-${_id.month}`;
    monthlyRevenueMap.set(key, (monthlyRevenueMap.get(key) ?? 0) + revenue);
  });

  const monthlyRevenue = [];
  for (let i = 11; i >= 0; i -= 1) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${date.getFullYear()}-${date.getMonth() + 1}`;
    monthlyRevenue.push({
      month: monthNames[date.getMonth()],
      revenue: monthlyRevenueMap.get(key) ?? 0,
    });
  }

  const recentBookings = [
    ...recentAdventureBookings.map((booking) => ({
      id: `B-${booking._id.toString()}`,
      type: "session",
      user: booking.user?.name ?? "Unknown",
      adventure: booking.session?.adventureId?.name ?? "Adventure",
      date: booking.createdAt,
      amount: booking.amount ?? 0,
    })),
    ...recentEventBookings.map((booking) => ({
      id: `E-${booking._id.toString()}`,
      type: "event",
      user: booking.user?.name ?? "Unknown",
      adventure: booking.event?.title ?? "Event",
      date: booking.createdAt,
      amount: booking.amount ?? 0,
    })),
  ]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5)
    .map((entry) => ({
      ...entry,
      date: entry.date,
    }));

  res.status(200).json(
    new ApiResponse(
      200,
      {
        totalRevenue,
        totalUsers,
        activeAdventures: totalAdventures,
        totalBookings,
        revenueIncrease,
        userIncrease,
        adventureIncrease,
        bookingIncrease,
        recentBookings,
        topAdventures: topAdventuresRaw.map((item) => ({
          id: item._id,
          name: item.name,
          bookings: item.bookings,
          revenue: item.revenue,
        })),
        monthlyRevenue,
      },
      "Dashboard stats retrieved successfully"
    )
  );
});

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
