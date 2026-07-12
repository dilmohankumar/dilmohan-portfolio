import { Router } from "express";
import { body, param } from "express-validator";
import { makeCrudController } from "../controllers/crudFactory.js";
import { Experience } from "../models/Experience.js";
import { requireAdmin } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";

const router = Router();
const { list, create, update, remove } = makeCrudController(Experience, ["company", "role", "duration", "icon", "achievements"]);

const idCheck = [param("id").isMongoId().withMessage("Invalid id")];
const createRules = [
  body("company").isString().trim().isLength({ min: 1, max: 100 }),
  body("role").isString().trim().isLength({ min: 1, max: 100 }),
  body("duration").isString().trim().isLength({ min: 1, max: 60 }),
  body("icon").optional().isString().trim().isLength({ max: 10 }),
  body("achievements").optional().isArray(),
];
const updateRules = [
  body("company").optional().isString().trim().isLength({ min: 1, max: 100 }),
  body("role").optional().isString().trim().isLength({ min: 1, max: 100 }),
  body("duration").optional().isString().trim().isLength({ min: 1, max: 60 }),
  body("icon").optional().isString().trim().isLength({ max: 10 }),
  body("achievements").optional().isArray(),
];

router.get("/", list);
router.post("/", requireAdmin, createRules, validate, create);
router.patch("/:id", requireAdmin, [...idCheck, ...updateRules], validate, update);
router.delete("/:id", requireAdmin, idCheck, validate, remove);

export default router;
