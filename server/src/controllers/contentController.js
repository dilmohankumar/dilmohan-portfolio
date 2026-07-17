import { Education } from "../models/Education.js";
import { Experience } from "../models/Experience.js";
import { Project } from "../models/Project.js";
import { Section } from "../models/Section.js";
import { SiteContent } from "../models/SiteContent.js";
import { AppError } from "../utils/AppError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const CONTENT_FIELDS = [
  "name",
  "heroGreeting",
  "roles",
  "bio",
  "avatarEmoji",
  "avatarLabel",
  "avatarLocation",
  "accentColor",
  "logoText",
  "navLinks",
  "stats",
  "skills",
  "certifications",
  "contact",
];

async function getSiteContentOrThrow() {
  const content = await SiteContent.findOne({ key: "main" });
  if (!content) throw new AppError("Site content not found — run the seed script", 500);
  return content;
}

export const getContent = asyncHandler(async (req, res) => {
  res.json({ data: await getSiteContentOrThrow() });
});

export const updateContent = asyncHandler(async (req, res) => {
  const updates = CONTENT_FIELDS.reduce((acc, field) => {
    if (req.body[field] !== undefined) acc[field] = req.body[field];
    return acc;
  }, {});

  const content = await SiteContent.findOneAndUpdate({ key: "main" }, updates, {
    new: true,
    runValidators: true,
  });
  if (!content) throw new AppError("Site content not found — run the seed script", 500);
  res.json({ data: content });
});

export const getHome = asyncHandler(async (req, res) => {
  const [content, projects, experience, education, sections] = await Promise.all([
    getSiteContentOrThrow(),
    Project.find().sort({ createdAt: 1 }),
    Experience.find().sort({ createdAt: 1 }),
    Education.find().sort({ createdAt: 1 }),
    Section.find().sort({ order: 1 }),
  ]);
  res.json({ data: { content, projects, experience, education, sections } });
});
