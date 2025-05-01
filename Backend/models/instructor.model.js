import mongoose from "mongoose";
import bcrypt from "bcrypt";

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

