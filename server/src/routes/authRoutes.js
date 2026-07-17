import { Router } from "express";
import { body } from "express-validator";
import { login, logout, me, register } from "../controllers/authController.js";
import { loginLimiter, registerLimiter } from "../middleware/rateLimiter.js";
import { validate } from "../middleware/validate.js";

const router = Router();

router.post(
  "/login",
  loginLimiter,
  [body("email").isEmail().withMessage("Valid email required"), body("password").isString().notEmpty().withMessage("Password required")],
  validate,
  login
);

router.post(
  "/register",
  registerLimiter,
  [
    body("name").optional().isString().trim().isLength({ max: 100 }),
    body("email").isEmail().withMessage("Valid email required"),
    body("username")
      .isString()
      .trim()
      .toLowerCase()
      .matches(/^[a-z0-9-]{3,30}$/)
      .withMessage("Username must be 3-30 characters: lowercase letters, numbers, and hyphens only"),
    body("password").isString().isLength({ min: 8 }).withMessage("Password must be at least 8 characters"),
  ],
  validate,
  register
);

router.post("/logout", logout);
router.get("/me", me);

export default router;
