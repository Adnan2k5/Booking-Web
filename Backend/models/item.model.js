import mongoose from "mongoose";
import Category from "./category.model.js";
import translateText from "../middlewares/translate.middleware.js";

const itemSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        name_it: { type: String }, // Italian translation

        description: {
            type: String,
            required: true,
            trim: true,
        },
        description_it: { type: String }, // Italian translation

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
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
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
    },
    { timestamps: true }
);

itemSchema.index({ location: "2dsphere" });

itemSchema.pre('save', async function (next) {
    if (!this.name_it) {
        this.name_it = await translateText(this.name, 'it');
    }
    if (!this.description_it) {
        this.description_it = await translateText(this.description, 'it');
    }
    next();
});

export const Item = mongoose.model("Item", itemSchema);