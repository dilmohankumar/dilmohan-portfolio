import mongoose from "mongoose";

const experienceSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    company: { type: String, required: true, trim: true, maxlength: 100 },
    role: { type: String, required: true, trim: true, maxlength: 100 },
    duration: { type: String, required: true, trim: true, maxlength: 60 },
    icon: { type: String, trim: true, maxlength: 10, default: "💼" },
    achievements: [{ type: String, trim: true, maxlength: 600 }],
  },
  { timestamps: true }
);

export const Experience = mongoose.model("Experience", experienceSchema);
