import mongoose from "mongoose";

const HEX_COLOR = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

// One palette per mode (dark/light) so admins can restyle both looks independently.
const palette = (defaults) =>
  new mongoose.Schema(
    {
      bg: { type: String, trim: true, match: HEX_COLOR, default: defaults.bg },
      text: { type: String, trim: true, match: HEX_COLOR, default: defaults.text },
      card: { type: String, trim: true, match: HEX_COLOR, default: defaults.card },
      cardBorder: { type: String, trim: true, match: HEX_COLOR, default: defaults.cardBorder },
      muted: { type: String, trim: true, match: HEX_COLOR, default: defaults.muted },
    },
    { _id: false }
  );

const themeSchema = new mongoose.Schema(
  {
    // Name of the preset this palette started from — "custom" once colors are hand-edited.
    preset: { type: String, trim: true, maxlength: 30, default: "Classic Emerald" },
    font: { type: String, enum: ["mono", "sans", "serif"], default: "mono" },
    dark: {
      type: palette({ bg: "#0d0d0d", text: "#e8e0d0", card: "#181818", cardBorder: "#2a2a2a", muted: "#888888" }),
      default: () => ({}),
    },
    light: {
      type: palette({ bg: "#f4f1eb", text: "#1a1a1a", card: "#ffffff", cardBorder: "#e0dbd0", muted: "#666666" }),
      default: () => ({}),
    },
    // URL (uploaded or external) rendered behind the whole page, dimmed by backgroundOverlay.
    backgroundImage: { type: String, trim: true, maxlength: 500, default: "" },
    backgroundOverlay: { type: Number, min: 0, max: 1, default: 0.85 },
  },
  { _id: false }
);

const statSchema = new mongoose.Schema(
  {
    value: { type: String, required: true, trim: true, maxlength: 10 },
    label: { type: String, required: true, trim: true, maxlength: 30 },
  },
  { _id: false }
);

const navLinkSchema = new mongoose.Schema(
  {
    label: { type: String, required: true, trim: true, maxlength: 30 },
    // The DOM id scrollTo() targets — not every section renders one, so this is
    // free text rather than a ref; admin is responsible for pointing it at a real id.
    target: { type: String, required: true, trim: true, maxlength: 30 },
  },
  { _id: false }
);

const siteContentSchema = new mongoose.Schema(
  {
    // One content doc per user — this is what scopes a portfolio to its owner.
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },

    name: { type: String, required: true, trim: true, maxlength: 100 },
    heroGreeting: { type: String, trim: true, maxlength: 100 },
    roles: [{ type: String, trim: true, maxlength: 60 }],
    bio: { type: String, required: true, trim: true, maxlength: 1000 },

    avatarEmoji: { type: String, trim: true, maxlength: 10 },
    avatarLabel: { type: String, trim: true, maxlength: 40 },
    avatarLocation: { type: String, trim: true, maxlength: 60 },

    // Site-wide appearance & header — drives the accent color and nav shown on the public page.
    accentColor: {
      type: String,
      trim: true,
      default: "#00c896",
      match: /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/,
    },
    logoText: { type: String, trim: true, maxlength: 20, default: "DK." },
    navLinks: [navLinkSchema],
    theme: { type: themeSchema, default: () => ({}) },

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
