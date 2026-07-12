import { Router } from "express";
import { body, param } from "express-validator";
import { makeCrudController } from "../controllers/crudFactory.js";
import { Education } from "../models/Education.js";
import { requireAdmin } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";

const router = Router();
const { list, create, update, remove } = makeCrudController(Education, ["school", "degree", "duration", "percentage"]);

const idCheck = [param("id").isMongoId().withMessage("Invalid id")];
const createRules = [
  body("school").isString().trim().isLength({ min: 1, max: 150 }),
  body("degree").isString().trim().isLength({ min: 1, max: 150 }),
  body("duration").isString().trim().isLength({ min: 1, max: 60 }),
  body("percentage").optional().isString().trim().isLength({ max: 20 }),
];
const updateRules = [
  body("school").optional().isString().trim().isLength({ min: 1, max: 150 }),
  body("degree").optional().isString().trim().isLength({ min: 1, max: 150 }),
  body("duration").optional().isString().trim().isLength({ min: 1, max: 60 }),
  body("percentage").optional().isString().trim().isLength({ max: 20 }),
];

router.get("/", list);
router.post("/", requireAdmin, createRules, validate, create);
router.patch("/:id", requireAdmin, [...idCheck, ...updateRules], validate, update);
router.delete("/:id", requireAdmin, idCheck, validate, remove);

export default router;
