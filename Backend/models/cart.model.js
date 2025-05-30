import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
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
                    required: true,
                    min: 1,
                },
                rentalPeriod: {
                    type: Number, // in days
                    required: true,
                    min: 1,
                },
                purchase: {
                    type: Boolean,
                    default: false, // true if the item is being purchased
                },
            },
        ],
    },
    { timestamps: true }
);

export const Cart = mongoose.model("Cart", cartSchema);
