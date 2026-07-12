import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    desc: { type: String, required: true, trim: true, maxlength: 500 },
    tech: [{ type: String, trim: true, maxlength: 40 }],
    emoji: { type: String, trim: true, maxlength: 10, default: "🚀" },
  },
  { timestamps: true }
);

export const Project = mongoose.model("Project", projectSchema);
