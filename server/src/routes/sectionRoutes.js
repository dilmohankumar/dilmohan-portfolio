import { Router } from "express";
import { body, param } from "express-validator";
import {
  createCustomSection,
  deleteSection,
  listMissingBuiltIns,
  listSections,
  reorderSections,
  updateSection,
} from "../controllers/sectionController.js";
import { BUILT_IN_TYPES, CUSTOM_LAYOUTS } from "../models/Section.js";
import { requireAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";

const router = Router();

router.get("/", requireAuth, listSections);
router.get("/missing-built-ins", requireAuth, listMissingBuiltIns);

router.post(
  "/",
  requireAuth,
  [
    body("title").optional().isString().trim().isLength({ max: 100 }),
    body("layout").optional().isIn(CUSTOM_LAYOUTS),
    body("type").optional().isIn(BUILT_IN_TYPES),
  ],
  validate,
  createCustomSection
);

// Must be registered before "/:id" — otherwise Express matches the literal
// path "reorder" against the ":id" param route first.
router.patch(
  "/reorder",
  requireAuth,
  [body("order").isArray({ min: 1 }), body("order.*").isMongoId()],
  validate,
  reorderSections
);

router.patch(
  "/:id",
  requireAuth,
  [
    param("id").isMongoId(),
    body("title").optional().isString().trim().isLength({ max: 100 }),
    body("visible").optional().isBoolean(),
    body("layout").optional().isIn(CUSTOM_LAYOUTS),
    body("items").optional().isArray({ max: 50 }),
    body("items.*.heading").optional().isString().trim().isLength({ max: 120 }),
    body("items.*.description").optional().isString().trim().isLength({ max: 500 }),
    body("items.*.emoji").optional().isString().trim().isLength({ max: 10 }),
    body("items.*.text").optional().isString().trim().isLength({ max: 300 }),
    body("items.*.label").optional().isString().trim().isLength({ max: 100 }),
    body("items.*.url").optional().isString().trim().isLength({ max: 500 }),
  ],
  validate,
  updateSection
);

router.delete("/:id", requireAuth, [param("id").isMongoId()], validate, deleteSection);

export default router;
