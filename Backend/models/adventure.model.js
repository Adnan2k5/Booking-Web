import mongoose from "mongoose";

const adventureSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            index: true,
        },
        description: {
            type: String,
            trim: true,
        },
        location: {
            type: String,
            required: true,
            trim: true,
        },
        image: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        exp: {
            type: Number,
        }
    },
    {
        timestamps: true,
    }
);

export const Adventure = mongoose.model("Adventure", adventureSchema);
