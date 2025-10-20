import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Instructor",
    },
    hotel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel",
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Ensure a review targets either an instructor or a hotel
ReviewSchema.index({ user: 1, instructor: 1 }, { unique: true, partialFilterExpression: { instructor: { $type: 'objectId' } } });
ReviewSchema.index({ user: 1, hotel: 1 }, { unique: true, partialFilterExpression: { hotel: { $type: 'objectId' } } });

export const Review = mongoose.model("Review", ReviewSchema);
