import mongoose from "mongoose";

const statSchema = new mongoose.Schema(
  {
    value: { type: String, required: true, trim: true, maxlength: 10 },
    label: { type: String, required: true, trim: true, maxlength: 30 },
  },
  { _id: false }
);

const siteContentSchema = new mongoose.Schema(
  {
    key: { type: String, default: "main", unique: true },

    name: { type: String, required: true, trim: true, maxlength: 100 },
    heroGreeting: { type: String, trim: true, maxlength: 100 },
    roles: [{ type: String, trim: true, maxlength: 60 }],
    bio: { type: String, required: true, trim: true, maxlength: 1000 },

    avatarEmoji: { type: String, trim: true, maxlength: 10 },
    avatarLabel: { type: String, trim: true, maxlength: 40 },
    avatarLocation: { type: String, trim: true, maxlength: 60 },

    stats: [statSchema],
    skills: [{ type: String, trim: true, maxlength: 40 }],
    certifications: [{ type: String, trim: true, maxlength: 200 }],

    contact: {
      email: { type: String, required: true, trim: true, lowercase: true },
      phone: { type: String, trim: true },
      github: { type: String, trim: true },
      linkedin: { type: String, trim: true },
    },
  },
  { timestamps: true }
);

export const SiteContent = mongoose.model("SiteContent", siteContentSchema);
