import mongoose from "mongoose";

const hotelBookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
      required: true,
    },
    guests: {
      type: Number,
      min: 1,
      required: true,
    },
    numberOfRooms: {
      type: Number,
      min: 1,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending",
    },
    transactionId: {
      type: String,
      trim: true,
    },
    amount: {
      type: Number,
      min: 0,
    },
    bookingDate: {
      type: Date,
      default: Date.now,
    },
    hotel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel",
      index: true,
      required: true,
    },
    checkInDate: {
      type: Date,
      required: true,
    },
    checkOutDate: {
      type: Date,
      required: true,
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

export const HotelBooking = mongoose.model("hotelBooking", hotelBookingSchema);
