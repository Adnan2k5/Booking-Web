import { User } from "../models/user.model.js";
import { UserAchievement } from "../models/userAchievement.model.js";
import { asyncHandler } from "./asyncHandler.js";

export const updateUserAchievement = asyncHandler(async (userId) => {
  const userAdventureDetails = await User.aggregate([
    // Stage 1: Match the specific user
    {
      $match: { _id: userId },
    },

    // Stage 2: Lookup user's bookings
    {
      $lookup: {
        from: "bookings",
        localField: "_id",
        foreignField: "user",
        as: "userBookings",
      },
    },

    // Stage 3: Filter only completed adventure bookings
    {
      $addFields: {
        completedAdventureBookings: {
          $filter: {
            input: "$userBookings",
            cond: {
              $and: [
                { $eq: ["$$this.status", "confirmed"] },
                { $eq: ["$$this.paymentStatus", "completed"] },
                { $ne: ["$$this.adventure", null] }, // Has adventure reference
              ],
            },
          },
        },
      },
    },

    // Stage 4: Lookup adventure details for completed bookings
    {
      $lookup: {
        from: "adventures",
        localField: "completedAdventureBookings.adventure",
        foreignField: "_id",
        as: "adventureDetails",
      },
    },

    // Stage 5: Lookup user adventure experiences
    {
      $lookup: {
        from: "useradventureexperiences",
        localField: "_id",
        foreignField: "user",
        as: "experienceRecords",
      },
    },

    // Stage 6: Create comprehensive adventure completion summary
    {
      $project: {
        _id: 1,
        name: 1,
        email: 1,
        level: 1,

        // Total completed adventures
        totalCompletedAdventures: { $size: "$completedAdventureBookings" },

        // Adventures by category
        adventuresByCategory: {
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
                        k: "$$this.category",
                        v: {
                          $add: [
                            {
                              $ifNull: [
                                {
                                  $getField: {
                                    field: "$$this.category",
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

        // Total experience points
        totalExperiencePoints: {
          $sum: "$experienceRecords.experiencePoints",
        },

        // Calculate level based on experience points (100 XP per level)
        level: {
          $floor: {
            $divide: [
              { $sum: "$experienceRecords.experiencePoints" }, // Total XP
              100, // XP per level
            ],
          },
        },

        // Experience by category
        experienceByCategory: {
          $arrayToObject: {
            $map: {
              input: "$experienceRecords",
              as: "exp",
              in: {
                k: "$$exp.adventureCategory",
                v: "$$exp.experiencePoints",
              },
            },
          },
        },

        // Adventure statistics
        adventureStats: {
          uniqueCategories: {
            $size: {
              $setUnion: ["$adventureDetails.category", []],
            },
          },
        },
      },
    },
  ]);
  if (userAdventureDetails.length === 0) return;
  const userData = userAdventureDetails[0];
  //   console.log('userdata -> ', userData);
  // Use the static method to save/update
  const savedAchievement = await UserAchievement.createOrUpdate({
    userId: userData._id,
    email: userData.email,
    name: userData.name,
    level: userData.level,
    totalCompletedAdventures: userData.totalCompletedAdventures,
    adventuresByCategory: new Map(
      Object.entries(userData.adventuresByCategory || {})
    ),
    totalExperiencePoints: userData.totalExperiencePoints,
    experienceByCategory: new Map(
      Object.entries(userData.experienceByCategory || {})
    ),
    adventureStats: userData.adventureStats,
  });
  //   console.log('saved', savedAchievement);
  return savedAchievement;
});
