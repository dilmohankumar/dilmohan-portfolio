import { User } from "../models/User.js";
import { AppError } from "../utils/AppError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { verifyAuthToken } from "../utils/token.js";

export const requireAuth = asyncHandler(async (req, res, next) => {
  const token = req.cookies?.token;
  if (!token) throw new AppError("Not authenticated", 401);

  let payload;
  try {
    payload = verifyAuthToken(token);
  } catch {
    throw new AppError("Session expired or invalid, please log in again", 401);
  }

  // Re-check the user still exists on every request so a deleted account
  // invalidates any outstanding tokens immediately instead of at natural expiry.
  const user = await User.findById(payload.sub);
  if (!user) throw new AppError("Not authenticated", 401);

  // CSRF only matters for state-changing requests — the frontend's GET calls never send this
  // header (nothing to forge), and now that requireAuth also gates read routes like /me/home
  // for per-user scoping, enforcing it there would lock reads out entirely.
  if (!["GET", "HEAD", "OPTIONS"].includes(req.method)) {
    const csrfHeader = req.get("X-CSRF-Token");
    if (!csrfHeader || csrfHeader !== payload.csrf) {
      throw new AppError("Invalid or missing CSRF token", 403);
    }
  }

  req.user = { id: user._id.toString(), email: user.email, username: user.username };
  next();
});
