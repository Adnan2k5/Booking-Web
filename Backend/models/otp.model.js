import mongoose from "mongoose";

const otpSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true,
        },
        otp: {
            type: Number,
            required: true,
        },
        createdAt: {
            type: Date,
            default: Date.now,
            expires: 300 // 300 seconds = 5 minutes
        }
    }
);

export const Otp = mongoose.model("Otp", otpSchema);
