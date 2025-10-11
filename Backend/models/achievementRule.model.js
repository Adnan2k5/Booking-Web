import mongoose from "mongoose";

// Defines a rule like: for a specific adventure (or globally),
// when user's completedSessions reaches a threshold, award an achievement.
const achievementRuleSchema = new mongoose.Schema(
  {
    // Human-readable unique name for the rule
    name: { type: String, required: true, trim: true },
    // Optional alternate display title (backward-compatible)
    title: { type: String, trim: true },
    description: { type: String, default: "" },
    // Optional UI grouping label, e.g., "Tree Climbing"
    label: { type: String, default: "" },

    // If set, the rule applies to this specific adventure.
    // If null, treat as a global rule across all adventures (sum of sessions).
    adventure: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Adventure",
      default: null,
      index: true,
    },

    // Metric to evaluate for threshold.
    metric: {
      type: String,
      enum: ["completedSessions", "confirmedBookings"],
      default: "completedSessions",
    },

    // Threshold for the metric. e.g., 1, 5, 10
    threshold: { type: Number, required: true, min: 1 },

    // Optional visual/icon tag for frontend badges
    icon: { type: String, default: "" },

    // Controls whether this rule is currently used for awarding.
    active: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

// Prevent duplicate names for the same adventure to keep UX clean
achievementRuleSchema.index({ adventure: 1, name: 1 }, { unique: true, sparse: true });

export const AchievementRule = mongoose.model(
  "AchievementRule",
  achievementRuleSchema
);
