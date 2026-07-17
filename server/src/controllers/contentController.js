import { Education } from "../models/Education.js";
import { Experience } from "../models/Experience.js";
import { Project } from "../models/Project.js";
import { Section } from "../models/Section.js";
import { SiteContent } from "../models/SiteContent.js";
import { User } from "../models/User.js";
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

async function getSiteContentOrThrow(userId) {
  const content = await SiteContent.findOne({ userId });
  if (!content) throw new AppError("Site content not found", 500);
  return content;
}

async function homeAggregateFor(userId) {
  const [content, projects, experience, education, sections] = await Promise.all([
    getSiteContentOrThrow(userId),
    Project.find({ userId }).sort({ createdAt: 1 }),
    Experience.find({ userId }).sort({ createdAt: 1 }),
    Education.find({ userId }).sort({ createdAt: 1 }),
    Section.find({ userId }).sort({ order: 1 }),
  ]);
  return { content, projects, experience, education, sections };
}

export const getContent = asyncHandler(async (req, res) => {
  res.json({ data: await getSiteContentOrThrow(req.user.id) });
});

export const updateContent = asyncHandler(async (req, res) => {
  const updates = CONTENT_FIELDS.reduce((acc, field) => {
    if (req.body[field] !== undefined) acc[field] = req.body[field];
    return acc;
  }, {});

  const content = await SiteContent.findOneAndUpdate({ userId: req.user.id }, updates, {
    new: true,
    runValidators: true,
  });
  if (!content) throw new AppError("Site content not found", 500);
  res.json({ data: content });
});

// Authenticated aggregate for the admin dashboard — always the logged-in user's own data,
// regardless of whether any of it is visible/published.
export const getMyHome = asyncHandler(async (req, res) => {
  res.json({ data: await homeAggregateFor(req.user.id) });
});

// Public aggregate behind /portfolio/:username — what a visitor to someone's page sees.
export const getPublicHome = asyncHandler(async (req, res) => {
  const owner = await User.findOne({ username: req.params.username.toLowerCase() });
  if (!owner) throw new AppError("Portfolio not found", 404);
  res.json({ data: await homeAggregateFor(owner._id) });
});
