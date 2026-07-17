import mongoose from "mongoose";

export const BUILT_IN_TYPES = [
  "hero",
  "experience",
  "projects",
  "skills",
  "education",
  "certifications",
  "contact",
];

// Default title used when (re)creating a built-in section — Hero's is blank since
// it isn't rendered publicly, it's just a label in the admin's drag-and-drop list.
export const BUILT_IN_DEFAULT_TITLES = {
  hero: "",
  experience: "Experience",
  projects: "Projects",
  skills: "Skills",
  education: "Education",
  certifications: "Certifications",
  contact: "Contact",
};

// The 3 layout templates a custom section can be created as. Fixed at creation
// time (not changeable via PATCH) — switching layouts on an existing section
// would leave a confusing mix of populated/empty fields on its items.
export const CUSTOM_LAYOUTS = ["cards", "list", "links"];

const itemSchema = new mongoose.Schema(
  {
    // cards layout (Projects-style grid)
    heading: { type: String, trim: true, maxlength: 120 },
    description: { type: String, trim: true, maxlength: 500 },
    emoji: { type: String, trim: true, maxlength: 10 },
    // list layout (Certifications-style bullet list)
    text: { type: String, trim: true, maxlength: 300 },
    // links layout (Contact-style clickable buttons)
    label: { type: String, trim: true, maxlength: 100 },
    url: { type: String, trim: true, maxlength: 500 },
  },
  { _id: false }
);

const sectionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: {
      type: String,
      enum: [...BUILT_IN_TYPES, "custom"],
      required: true,
    },
    title: { type: String, trim: true, maxlength: 100, default: "" },
    order: { type: Number, required: true },
    visible: { type: Boolean, default: true },
    layout: { type: String, enum: CUSTOM_LAYOUTS, default: "cards" }, // only meaningful for type: "custom"
    items: [itemSchema], // only meaningful for type: "custom"
    // Set true only for built-in-type sections. Exists purely so the partial index below can
    // target them via an equality match — MongoDB's partialFilterExpression doesn't support
    // $ne/$nin, so we can't filter directly on `type !== "custom"`.
    builtIn: { type: Boolean },
  },
  { timestamps: true }
);

// A built-in type may only ever exist once per user; custom sections are unrestricted.
sectionSchema.index(
  { userId: 1, type: 1 },
  { unique: true, partialFilterExpression: { builtIn: true } }
);

export const Section = mongoose.model("Section", sectionSchema);
