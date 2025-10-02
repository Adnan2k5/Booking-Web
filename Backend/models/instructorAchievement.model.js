import mongoose from "mongoose";

const instructorAchievementSchema = new mongoose.Schema(
  {
    instructorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Since instructors are Users with role "instructor"
      required: true,
      unique: true,
      index: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    level: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Session completion metrics
    totalCompletedSessions: {
      type: Number,
      default: 0,
      min: 0,
    },

    totalUniqueCustomerServed: {
      // ✅ Matches your field name
      type: Number,
      default: 0,
      min: 0,
    },

    // Sessions grouped by category
    sessionsByCategory: {
      type: Map,
      of: Number,
      default: new Map(),
    },

    // Experience points system
    totalExperiencePoints: {
      type: Number,
      default: 0,
      min: 0,
    },

    experienceByCategory: {
      type: Map,
      of: Number,
      default: new Map(),
    },

    // Financial metrics
    totalEarnings: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Instructor performance statistics
    instructorStats: {
      uniqueCategories: {
        type: Number,
        default: 0,
        min: 0,
      },
      totalSessions: {
        type: Number,
        default: 0,
        min: 0,
      },
      activeSessions: {
        type: Number,
        default: 0,
        min: 0,
      },
      completionRate: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
      },
    },

    // Additional fields from instructor profile
    documentVerified: {
      type: String,
      enum: ["pending", "verified", "rejected"],
      default: "pending",
    },

    lastUpdated: {
      type: Date,
      default: Date.now,
    },

    calculatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for performance
instructorAchievementSchema.index({ instructorId: 1 });
instructorAchievementSchema.index({ level: -1 });
instructorAchievementSchema.index({ totalEarnings: -1 });
instructorAchievementSchema.index({ "instructorStats.completionRate": -1 });

// Static method to create or update achievement
instructorAchievementSchema.statics.createOrUpdate = async function (
  achievementData
) {
  const { instructorId, ...updateData } = achievementData;

  return await this.findOneAndUpdate(
    { instructorId },
    {
      ...updateData,
      calculatedAt: new Date(),
    },
    {
      upsert: true,
      new: true,
      runValidators: true,
    }
  );
};

export const InstructorAchievement = mongoose.model(
  "InstructorAchievement",
  instructorAchievementSchema
);
