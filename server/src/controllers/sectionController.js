import mongoose from "mongoose";
import { BUILT_IN_DEFAULT_TITLES, BUILT_IN_TYPES, CUSTOM_LAYOUTS, Section } from "../models/Section.js";
import { AppError } from "../utils/AppError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const listSections = asyncHandler(async (req, res) => {
  const sections = await Section.find().sort({ order: 1 });
  res.json({ data: sections });
});

// Returns which built-in section types don't currently have a Section doc — used by
// the admin's "+ Add" picker to offer restoring a deleted built-in section, so that
// never requires terminal/seed-script access.
export const listMissingBuiltIns = asyncHandler(async (req, res) => {
  const existingTypes = new Set((await Section.find({ type: { $ne: "custom" } }).select("type")).map((s) => s.type));
  const missing = BUILT_IN_TYPES.filter((t) => !existingTypes.has(t));
  res.json({ data: missing });
});

async function nextOrder() {
  const last = await Section.findOne().sort({ order: -1 });
  return last ? last.order + 1 : 0;
}

export const createCustomSection = asyncHandler(async (req, res) => {
  const { type } = req.body;

  if (type && BUILT_IN_TYPES.includes(type)) {
    const alreadyExists = await Section.findOne({ type });
    if (alreadyExists) throw new AppError(`A "${type}" section already exists`, 409);
    const section = await Section.create({
      type,
      title: BUILT_IN_DEFAULT_TITLES[type],
      order: await nextOrder(),
    });
    return res.status(201).json({ data: section });
  }

  const layout = CUSTOM_LAYOUTS.includes(req.body.layout) ? req.body.layout : "cards";
  const section = await Section.create({
    type: "custom",
    title: req.body.title?.trim() || "New Section",
    order: await nextOrder(),
    layout,
    items: [],
  });
  res.status(201).json({ data: section });
});

export const updateSection = asyncHandler(async (req, res) => {
  const section = await Section.findById(req.params.id);
  if (!section) throw new AppError("Not found", 404);

  const updates = {};
  if (req.body.title !== undefined) updates.title = req.body.title;
  if (req.body.visible !== undefined) updates.visible = req.body.visible;
  if (section.type === "custom" && req.body.items !== undefined) {
    updates.items = req.body.items;
  }
  if (section.type === "custom" && req.body.layout !== undefined && req.body.layout !== section.layout) {
    updates.layout = req.body.layout;
    // Cards/List/Links use different fields — carrying old items over would leave
    // stale, mismatched data sitting in fields the new layout never displays or edits.
    updates.items = [];
  }

  Object.assign(section, updates);
  await section.save();
  res.json({ data: section });
});

export const deleteSection = asyncHandler(async (req, res) => {
  const section = await Section.findById(req.params.id);
  if (!section) throw new AppError("Not found", 404);
  // Deleting a built-in section only removes its layout slot — the underlying content
  // (SiteContent fields, or the Project/Experience/Education collection) is untouched,
  // and re-running the seed script recreates any missing built-in section afterward.
  await section.deleteOne();
  res.json({ data: { id: req.params.id } });
});

export const reorderSections = asyncHandler(async (req, res) => {
  const { order } = req.body;

  const total = await Section.countDocuments();
  if (order.length !== total) {
    throw new AppError("Reorder list must include every section exactly once", 400);
  }
  if (new Set(order).size !== order.length) {
    throw new AppError("Reorder list contains duplicate ids", 400);
  }

  const existing = await Section.find({ _id: { $in: order } }).select("_id");
  if (existing.length !== order.length) {
    throw new AppError("Reorder list contains an unknown section id", 400);
  }

  await Section.bulkWrite(
    order.map((id, index) => ({
      updateOne: {
        filter: { _id: new mongoose.Types.ObjectId(id) },
        update: { $set: { order: index } },
      },
    }))
  );

  const sections = await Section.find().sort({ order: 1 });
  res.json({ data: sections });
});
