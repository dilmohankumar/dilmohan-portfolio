import { Admin } from "../models/Admin.js";
import { AppError } from "../utils/AppError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { verifyAuthToken } from "../utils/token.js";

export const requireAdmin = asyncHandler(async (req, res, next) => {
  const token = req.cookies?.token;
  if (!token) throw new AppError("Not authenticated", 401);

  let payload;
  try {
    payload = verifyAuthToken(token);
  } catch {
    throw new AppError("Session expired or invalid, please log in again", 401);
  }

  // Re-check the admin still exists on every request so a deleted account
  // invalidates any outstanding tokens immediately instead of at natural expiry.
  const admin = await Admin.findById(payload.sub);
  if (!admin) throw new AppError("Not authenticated", 401);

  const csrfHeader = req.get("X-CSRF-Token");
  if (!csrfHeader || csrfHeader !== payload.csrf) {
    throw new AppError("Invalid or missing CSRF token", 403);
  }

  req.admin = { id: admin._id.toString(), email: admin.email };
  next();
});
