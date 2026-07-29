import { Router } from "express";
import { body } from "express-validator";
import { getContent, getMyHome, getPublicHome, updateContent } from "../controllers/contentController.js";
import { requireAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";

const router = Router();

router.get("/me/home", requireAuth, getMyHome);
router.get("/portfolio/:username/home", getPublicHome);
router.get("/content", requireAuth, getContent);

router.patch(
  "/content",
  requireAuth,
  [
    body("name").optional().isString().trim().isLength({ min: 1, max: 100 }),
    body("heroGreeting").optional().isString().trim().isLength({ max: 100 }),
    body("bio").optional().isString().trim().isLength({ min: 1, max: 1000 }),
    body("roles").optional().isArray(),
    body("accentColor")
      .optional()
      .matches(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/),
    body("logoText").optional().isString().trim().isLength({ max: 20 }),
    body("navLinks").optional().isArray({ max: 10 }),
    body("navLinks.*.label").optional().isString().trim().isLength({ min: 1, max: 30 }),
    body("navLinks.*.target").optional().isString().trim().isLength({ min: 1, max: 30 }),
    body("theme").optional().isObject(),
    body("theme.preset").optional().isString().trim().isLength({ max: 30 }),
    body("theme.font").optional().isIn(["mono", "sans", "serif"]),
    body([
      "theme.dark.bg",
      "theme.dark.text",
      "theme.dark.card",
      "theme.dark.cardBorder",
      "theme.dark.muted",
      "theme.light.bg",
      "theme.light.text",
      "theme.light.card",
      "theme.light.cardBorder",
      "theme.light.muted",
    ])
      .optional()
      .matches(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/),
    body("theme.backgroundImage").optional({ values: "falsy" }).isString().trim().isLength({ max: 500 }),
    body("theme.backgroundOverlay").optional().isFloat({ min: 0, max: 1 }),
    body("stats").optional().isArray(),
    body("skills").optional().isArray(),
    body("certifications").optional().isArray(),
    body("contact.email").optional().isEmail(),
  ],
  validate,
  updateContent
);

export default router;
