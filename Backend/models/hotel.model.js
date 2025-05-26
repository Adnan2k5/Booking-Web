import mongoose from "mongoose";

const HotelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    location: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Location",
    },
    fullAddress: {
      type: String,
      required: true,
    },
    contactNo: {
      type: String,
      required: true,
    },
    managerName: {
      type: String,
      required: true,
    },
    noRoom: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
    },
    verified: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    amenities: {
      type: [
        {
          type: String,
        },
      ],
      required: true,
    },
    logo: {
      type: String,
    },
    medias: {
      type: [
        {
          type: String,
        },
      ],
    },
    license: {
      type: String,
    },
    certificate: {
      type: String,
    },
    insurance: {
      type: String,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

export const Hotel = mongoose.model("Hotel", HotelSchema);
