import mongoose from "mongoose";

const payoutSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      default: "USD",
      uppercase: true,
      trim: true,
    },
    note: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    batchId: {
      type: String,
      index: true,
    },
    itemId: {
      type: String,
      index: true,
    },

    status: {
      type: String,
      enum: ["QUEUED", "SENT", "SUCCESS", "FAILED"],
      default: "QUEUED",
      index: true,
    },

    rawResponse: { type: mongoose.Schema.Types.Mixed },
  },
  { timestamps: true }
);

export const Payout = mongoose.model("Payout", payoutSchema);
