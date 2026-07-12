import { Router } from "express";
import { body } from "express-validator";
import { login, logout, me } from "../controllers/authController.js";
import { loginLimiter } from "../middleware/rateLimiter.js";
import { validate } from "../middleware/validate.js";

const router = Router();

router.post(
  "/login",
  loginLimiter,
  [body("email").isEmail().withMessage("Valid email required"), body("password").isString().notEmpty().withMessage("Password required")],
  validate,
  login
);
router.post("/logout", logout);
router.get("/me", me);

export default router;
