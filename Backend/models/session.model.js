import moongoose from "mongoose";

const sessionSchema = new moongoose.Schema(
  {
    days: {
      type: String,
      enum: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    },
    status: {
      type: String,
      enum: ["active", "inactive", "cancelled", "expired", "completed"],
      default: "active",
    },
    price: {
      type: Number,
      required: true,
    },
    priceType: {
      type: String,
      enum: ["perHour", "perPerson", "perGroup", "perDay", "perMonth"],
      default: "perPerson",
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    startTime: {
      type: Date,
      required: true,
    },
    capacity: {
      type: Number,
      required: true,
    },
    adventureId: {
      type: moongoose.Schema.Types.ObjectId,
      ref: "Adventure",
      required: true,
    },
    instructorId: {
      type: moongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    notes: {
      type: String,
      default: "",
    },
    location: {
      type: moongoose.Schema.Types.ObjectId,
      ref: "Location",
      required: true,
    },
    booking: [
      {
        type: moongoose.Schema.Types.ObjectId,
        ref: "Booking",
      }],
  },
  {
    timestamps: true,
  }
);

export const Session = moongoose.model("Session", sessionSchema);
