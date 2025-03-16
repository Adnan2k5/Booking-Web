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
            index: true,
        },
        date: {
            type: Date,
            required: true,
            index: true,
        },
        image: {
            type: String,
            required: true,
        },
        exp: {
            type: Number,
        },
        instructor:
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },

        enrolled: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
    },
    {
        timestamps: true,
    }
);

export const Adventure = mongoose.model("Adventure", adventureSchema);
