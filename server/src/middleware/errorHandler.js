import { AppError } from "../utils/AppError.js";

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal server error";
  let details = err.details;

  if (err.name === "ValidationError" && err.errors) {
    statusCode = 400;
    message = "Validation failed";
    details = Object.values(err.errors).map((e) => ({ field: e.path, message: e.message }));
  } else if (err.name === "CastError") {
    statusCode = 400;
    message = `Invalid value for field "${err.path}"`;
  } else if (err.code === 11000) {
    statusCode = 409;
    message = "A record with that value already exists";
  } else if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Session expired or invalid, please log in again";
  }

  if (!(err instanceof AppError) && statusCode === 500) {
    console.error(err);
    message = "Internal server error";
    details = undefined;
  }

  res.status(statusCode).json({ error: { message, ...(details ? { details } : {}) } });
}
