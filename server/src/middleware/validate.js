import { validationResult } from "express-validator";
import { AppError } from "../utils/AppError.js";

export function validate(req, res, next) {
  const result = validationResult(req);
  if (result.isEmpty()) return next();

  const details = result.array({ onlyFirstError: true }).map((e) => ({
    field: e.path,
    message: e.msg,
  }));
  next(new AppError("Validation failed", 400, details));
}
