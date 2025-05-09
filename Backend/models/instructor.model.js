import mongoose from "mongoose";

const instructorSchema = new mongoose.Schema(
  {
    documentVerified: {
      type: String,
      enum: ["pending", "verified", "rejected"],
      default: "pending",
    },
    password: {
      type: String,
    },
    refreshToken: { type: String },
    sessions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Booking",
      },
    ],
    description: [
      {
        type: String,
      },
    ],
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
    avgReview: {
      type: Number,
      default: 0,
    }
  },
  {
    Timestamps: true,
  }
);

export const Instructor = mongoose.model("Instructor", instructorSchema);

