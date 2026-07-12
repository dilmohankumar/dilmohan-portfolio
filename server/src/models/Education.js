import mongoose from "mongoose";

const educationSchema = new mongoose.Schema(
  {
    school: { type: String, required: true, trim: true, maxlength: 150 },
    degree: { type: String, required: true, trim: true, maxlength: 150 },
    duration: { type: String, required: true, trim: true, maxlength: 60 },
    percentage: { type: String, trim: true, maxlength: 20 },
  },
  { timestamps: true }
);

export const Education = mongoose.model("Education", educationSchema);
