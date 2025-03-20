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
        medias: {
            type: [
                {
                    type: String,
                    required: true,
                }
            ],
            required: true,
            validate: {
                validator: function(v) {
                    return v.length >= 1;
                },
                message: 'At least one media item is required'
            }
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
                ref: "Booking",
            },
        ],
    },
    {
        timestamps: true,
    }
);

export const Adventure = mongoose.model("Adventure", adventureSchema);
