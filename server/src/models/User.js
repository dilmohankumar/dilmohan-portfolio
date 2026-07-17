import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, maxlength: 100 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    // Used in the public portfolio URL — /u/:username — so it's constrained to a URL-safe slug.
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      minlength: 3,
      maxlength: 30,
      match: /^[a-z0-9-]+$/,
    },
    passwordHash: { type: String, required: true, select: false },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
