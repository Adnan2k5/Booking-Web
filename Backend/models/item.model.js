import mongoose from "mongoose";
import { Category } from "./category.model.js";

const itemSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
            trim: true,
        },
        price: {
            type: Number,
            required: true,
        },
        category: {
            type: String,
            required: true,
            validate: {
                validator: async function (value) {
                    const exists = await Category.exists({ name: value });
                    return !!exists;
                },
                message: props => `${props.value} is not a valid category`
            }
        },
        adventure: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Adventure",
                required: true,
            },
        ],
        images: [
            {
                type: String,
                required: true,
            },
        ],
        availableQuantity: {
            type: Number,
            required: true,
            default: 0,
        },
        status: {
            type: String,
            enum: ["available", "rented", "reserved"],
            default: "available",
        },
        bookings: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Booking",
            },
        ],
        avgRating: {
            type: Number,
            default: 0,
            min: 0,
            max: 5,
        },
        totalReviews: {
            type: Number,
            default: 0,
        },
        location: {
            type: { type: String, enum: ['Point'], required: true },
            coordinates: { type: [Number], required: true }
        },
    },
    { timestamps: true }
);

itemSchema.index({ location: "2dsphere" });

export const Item = mongoose.model("Item", itemSchema);