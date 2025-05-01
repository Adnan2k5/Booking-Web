import moongoose from "mongoose";

const sessionSchema = new moongoose.Schema({
    days:
    {
        type: String,
        enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    },
    status: {
        type: String,
        enum: ["active", "inactive", "cancelled", "expired", "completed"],
        default: "active",
    },
    expiresAt: {
        type: Date,
        required: true,
    },
    startTime: {
        type: Date,
        required: true,
    },
    capacity: {
        type: Number,
        required: true,
    },
    adventureId: {
        type: moongoose.Schema.Types.ObjectId,
        ref: "Adventure",
        required: true,
    },
    instructorId: {
        type: moongoose.Schema.Types.ObjectId,
        ref: "Instructor",
        required: true,
    },
    notes: {
        type: String,
        default: "",
    },
    location: {
        type: String,
        required: true,
    },
    booking: {
        type: moongoose.Schema.Types.ObjectId,
        ref: "Booking",
    }
},
    {
        timestamps: true
    }
);

export const Session = moongoose.model("Session", sessionSchema);