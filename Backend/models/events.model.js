import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    level: {
      type: Number,
      required: true,
      min: 1,
      max: 10,
      default: 1,
    },
    medias: [
      {
        type: String,
        required: false,
      },
    ],
  },
  { timestamps: true }
);

export const Event = mongoose.model("Event", eventSchema);
