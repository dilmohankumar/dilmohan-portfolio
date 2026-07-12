import { AppError } from "../utils/AppError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Shared CRUD behavior for the itemized-list models (Project, Experience, Education) —
// each needs identical list/create/update/delete semantics, only the Model and allowed
// fields differ.
export function makeCrudController(Model, allowedFields) {
  const pick = (body) =>
    allowedFields.reduce((acc, field) => {
      if (body[field] !== undefined) acc[field] = body[field];
      return acc;
    }, {});

  const list = asyncHandler(async (req, res) => {
    const items = await Model.find().sort({ createdAt: 1 });
    res.json({ data: items });
  });

  const create = asyncHandler(async (req, res) => {
    const item = await Model.create(pick(req.body));
    res.status(201).json({ data: item });
  });

  const update = asyncHandler(async (req, res) => {
    const item = await Model.findByIdAndUpdate(req.params.id, pick(req.body), {
      new: true,
      runValidators: true,
    });
    if (!item) throw new AppError("Not found", 404);
    res.json({ data: item });
  });

  const remove = asyncHandler(async (req, res) => {
    const item = await Model.findByIdAndDelete(req.params.id);
    if (!item) throw new AppError("Not found", 404);
    res.json({ data: { id: req.params.id } });
  });

  return { list, create, update, remove };
}
