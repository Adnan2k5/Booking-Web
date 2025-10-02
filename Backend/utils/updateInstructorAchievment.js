import { User } from "../models/user.model.js";
import { asyncHandler } from "./asyncHandler.js";
import { InstructorAchievment } from "../models/instructorAchievment.model.js";

export const updateInstructorAchievment = asyncHandler(async (instructorId) => {
  const instructorDetails = await User.aggregate([
    // Stage 1: Match the specific instructor (User with instructor role)
    {
      $match: {
        _id: instructorId,
        role: "instructor", // ✅ Ensure we're matching an instructor
      },
    },

    // Stage 2: Lookup instructor's sessions
    {
      $lookup: {
        from: "sessions",
        localField: "_id",
        foreignField: "instructorId",
        as: "instructorSessions",
      },
    },

    // Stage 3: Lookup bookings for instructor's sessions
    {
      $lookup: {
        from: "bookings",
        localField: "instructorSessions._id",
        foreignField: "session",
        as: "sessionBookings",
      },
    },

    // Stage 4: Filter only completed session bookings
    {
      $addFields: {
        completedSessionBookings: {
          $filter: {
            input: "$sessionBookings",
            cond: {
              $and: [
                { $eq: ["$$this.status", "confirmed"] },
                { $ne: ["$$this.session", null] },
              ],
            },
          },
        },
      },
    },

    // Stage 5: Lookup adventure details for sessions
    {
      $lookup: {
        from: "adventures",
        localField: "instructorSessions.adventureId",
        foreignField: "_id",
        as: "adventureDetails",
      },
    },

    // Stage 6: Lookup instructor profile details
    {
      $lookup: {
        from: "instructors",
        localField: "instructor", // ✅ User model has instructor field
        foreignField: "_id",
        as: "instructorProfile",
      },
    },

    // Stage 8: Create comprehensive instructor achievement summary
    {
      $project: {
        _id: 1,
        name: 1,
        email: 1,
        role: 1,

        // Total completed sessions
        totalCompletedSessions: { $size: "$completedSessionBookings" },

        // Total students taught (unique users)
        totalUniqueCustomerServed: {
          $size: {
            $setUnion: ["$completedSessionBookings.user", []],
          },
        },

        // Sessions by adventure category
        // Use adventure name or provide default category
         sessionsByCategory: {
          $reduce: {
            input: "$adventureDetails",
            initialValue: {},
            in: {
              $mergeObjects: [
                "$$value",
                {
                  $arrayToObject: [
                    [
                      {
                        k: "$$this.name", // ✅ Using adventure name
                        v: {
                          $add: [
                            {
                              $ifNull: [
                                {
                                  $getField: {
                                    field: "$$this.name", // ✅ Using adventure name
                                    input: "$$value",
                                  },
                                },
                                0,
                              ],
                            },
                            1,
                          ],
                        },
                      },
                    ],
                  ],
                },
              ],
            },
          },
        },

        
        // ✅ Calculate experience points based on completed sessions (50 XP per session)
        totalExperiencePoints: {
          $multiply: [{ $size: "$completedSessionBookings" }, 50],
        },

        // ✅ Calculate level based on experience points (200 XP per level)
        level: {
          $floor: {
            $divide: [
              {
                $multiply: [{ $size: "$completedSessionBookings" }, 50],
              },
              200,
            ],
          },
        },

           // ✅ Experience by adventure NAME (treating name as category)
        experienceByCategory: {
          $reduce: {
            input: "$adventureDetails",
            initialValue: {},
            in: {
              $mergeObjects: [
                "$$value",
                {
                  $arrayToObject: [
                    [
                      {
                        k: "$$this.name", // ✅ Using adventure name as category
                        v: {
                          $add: [
                            {
                              $ifNull: [
                                {
                                  $getField: {
                                    field: "$$this.name",
                                    input: "$$value",
                                  },
                                },
                                0,
                              ],
                            },
                            50, // Add 50 XP for each session in this adventure
                          ],
                        },
                      },
                    ],
                  ],
                },
              ],
            },
          },
        },

        // Total earnings from completed sessions
        totalEarnings: {
          $sum: "$completedSessionBookings.amount",
        },

        // Instructor statistics
        instructorStats: {
          uniqueCategories: {
            $size: {
              $setUnion: ["$adventureDetails.category", []],
            },
          },
          totalSessions: { $size: "$instructorSessions" },
          activeSessions: {
            $size: {
              $filter: {
                input: "$instructorSessions",
                cond: { $eq: ["$$this.status", "active"] },
              },
            },
          },
          completionRate: {
            $cond: {
              if: { $gt: [{ $size: "$instructorSessions" }, 0] },
              then: {
                $round: [
                  {
                    $multiply: [
                      {
                        $divide: [
                          { $size: "$completedSessionBookings" },
                          { $size: "$instructorSessions" },
                        ],
                      },
                      100,
                    ],
                  },
                  2, // ✅ Round to 2 decimal places
                ],
              },
              else: 0,
            },
          },
        },

        // ✅ Additional instructor-specific metrics
        instructorProfile: { $arrayElemAt: ["$instructorProfile", 0] },
      },
    },
  ]);

  if (instructorDetails.length === 0) return null;

  const instructorData = instructorDetails[0];
  // ✅ Validate that this is actually an instructor
  if (instructorData.role !== "instructor") {
    throw new Error("User is not an instructor");
  }

  // Use the static method to save/update instructor achievement
  const savedAchievement = await InstructorAchievment.createOrUpdate({
    instructorId: instructorData._id,
    email: instructorData.email,
    name: instructorData.name,
    level: instructorData.level,
    totalCompletedSessions: instructorData.totalCompletedSessions,
    totalUniqueCustomerServed: instructorData.totalUniqueCustomerServed,
    sessionsByCategory: new Map(
      Object.entries(instructorData.sessionsByCategory || {})
    ),
    totalExperiencePoints: instructorData.totalExperiencePoints,
    experienceByCategory: new Map(
      Object.entries(instructorData.experienceByCategory || {})
    ),
    totalEarnings: instructorData.totalEarnings,
    instructorStats: instructorData.instructorStats,
    // ✅ Additional fields from instructor profile
    documentVerified:
      instructorData.instructorProfile?.documentVerified || "pending",
  });

  return savedAchievement;
});
