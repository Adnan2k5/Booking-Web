import mongoose from "mongoose";

const instructorAchievementSchema = new mongoose.Schema(
  {
    
    badgeLevel: {
      type: String,
      enum: [
        "New Adventurer",
        "Rising Star",
        "Trusted Pro",
        "Elite Instructor",
        "Full Send Legend",
      ],
      required: true,
    },
    
    communityContribution: {
      type: Boolean,
      default: false,
    },
    achievedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export const InstructorAchievement = mongoose.model(
  "InstructorAchievement",
  instructorAchievementSchema
);
