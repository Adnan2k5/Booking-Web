import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },
    adventure: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Adventure",
      index: true,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending",
    },
    transactionId: {
      type: String,
    },
    amount: {
      type: Number,
    },
    bookingDate: {
      type: Date,
      default: Date.now,
    },
    modeOfPayment: {
      type: String,
      enum: ["card", "cash"],
      default: "card",
    },
  },
  {
    timestamps: true,
  }
);

export const Booking = mongoose.model("Booking", bookingSchema);