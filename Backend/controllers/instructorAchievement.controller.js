import { Instructor } from "../models/instructor.model.js";
import { Booking } from "../models/booking.model.js";

export const getInstructorBadge = async (req, res) => {
  try {
    const instructorId = req.params.id;
    const instructor = await Instructor.findById(instructorId);

    if (!instructor) {
      return res.status(404).json({ message: "Instructor not found" });
    }
    console.log(instructorId)
    const completedBookings = await Booking.countDocuments({
      _id: { $in: instructor.sessions },
      status: "completed"
    });

  
    const monthsActive =
      (Date.now() - new Date(instructor.createdAt).getTime()) /
      (1000 * 60 * 60 * 24 * 30);

  
    let badge = "No Badge Yet";
    if (
      completedBookings >= 250 &&
      monthsActive >= 24
    ) {
      badge = "Full Send Legend";
    } else if (
      completedBookings >= 150 &&
      monthsActive >= 12
    ) {
      badge = "Elite Instructor";
    } else if (
      completedBookings >= 50 &&
      monthsActive >= 6
    ) {
      badge = "Trusted Pro";
    } else if (
      completedBookings >= 10 &&
      monthsActive >= 3
    ) {
      badge = "Rising Star";
    } else if (completedBookings >= 5) {
      badge = "New Adventurer";
    }

    res.json({
      badge,
      completedBookings,
      monthsActive: Math.floor(monthsActive),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
