import mongoose from "mongoose";

const termsSchema = new mongoose.Schema({
    version: {
        type: String,
        required: true,
        unique: true,
    },
    content: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ["draft", "published"],
        default: "draft",
    },
    publishedBy: {
        type: String,
    },
    publishedAt: {
        type: Date,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
}, { timestamps: true });

export const Terms = mongoose.model("Terms", termsSchema);