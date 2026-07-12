import { Router } from "express";
import { body } from "express-validator";
import { getContent, getHome, updateContent } from "../controllers/contentController.js";
import { requireAdmin } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";

const router = Router();

router.get("/home", getHome);
router.get("/content", getContent);

router.patch(
  "/content",
  requireAdmin,
  [
    body("name").optional().isString().trim().isLength({ min: 1, max: 100 }),
    body("heroGreeting").optional().isString().trim().isLength({ max: 100 }),
    body("bio").optional().isString().trim().isLength({ min: 1, max: 1000 }),
    body("roles").optional().isArray(),
    body("stats").optional().isArray(),
    body("skills").optional().isArray(),
    body("certifications").optional().isArray(),
    body("contact.email").optional().isEmail(),
  ],
  validate,
  updateContent
);

export default router;
