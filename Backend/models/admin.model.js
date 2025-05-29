import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
  adminRole: {
    type: [
      {
        type: String,
        enum: ["Hotel", "Instructor", "User"],
      },
    ],
    required: true,
  },
});

export const Admin = mongoose.model("Admin", adminSchema);
