import mongoose from "mongoose";

const itemBookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
      required: true,
    },
    items: [
      {
        item: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Item",
          required: true,
        },
        quantity: {
          type: Number,
          min: 1,
          required: true,
        },
        startDate: {
          type: Date,
        },
        endDate: {
          type: Date,
        },
        purchased: {
          type: Boolean,
          default: false,
        },
      },
    ],
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

export const ItemBooking = mongoose.model("ItemBooking", itemBookingSchema);
