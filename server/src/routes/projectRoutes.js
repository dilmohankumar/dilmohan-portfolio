import { Router } from "express";
import { body, param } from "express-validator";
import { makeCrudController } from "../controllers/crudFactory.js";
import { Project } from "../models/Project.js";
import { requireAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";

const router = Router();
const { list, create, update, remove } = makeCrudController(Project, ["name", "desc", "tech", "emoji"]);

const idCheck = [param("id").isMongoId().withMessage("Invalid id")];
const createRules = [
  body("name").isString().trim().isLength({ min: 1, max: 120 }),
  body("desc").isString().trim().isLength({ min: 1, max: 500 }),
  body("tech").optional().isArray(),
  body("emoji").optional().isString().trim().isLength({ max: 10 }),
];
const updateRules = [
  body("name").optional().isString().trim().isLength({ min: 1, max: 120 }),
  body("desc").optional().isString().trim().isLength({ min: 1, max: 500 }),
  body("tech").optional().isArray(),
  body("emoji").optional().isString().trim().isLength({ max: 10 }),
];

router.get("/", requireAuth, list);
router.post("/", requireAuth, createRules, validate, create);
router.patch("/:id", requireAuth, [...idCheck, ...updateRules], validate, update);
router.delete("/:id", requireAuth, idCheck, validate, remove);

export default router;
