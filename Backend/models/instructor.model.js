import mongoose from "mongoose";

const instructorSchema = new mongoose.Schema(
  {
    documentVerified: {
      type: String,
      enum: ["pending", "verified", "rejected"],
      default: "pending",
    },
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
    adventure: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Adventure",
    },
    location: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Location",
    },
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
    avgReview: {
      type: Number,
      default: 0,
    },
    portfolioMedias: [
      {
        type: String
      }
    ],
    certificate:
    {
      type: String
    },
    governmentId: {
      type: String
    },
    languages: [
      {
        type: String,
      },
    ],
  },
  {
    Timestamps: true,
  }
);

export const Instructor = mongoose.model("Instructor", instructorSchema);

