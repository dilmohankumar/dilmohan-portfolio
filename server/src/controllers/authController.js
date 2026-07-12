import bcrypt from "bcryptjs";
import { Admin } from "../models/Admin.js";
import { AppError } from "../utils/AppError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { authCookieOptions, generateCsrfToken, signAuthToken, verifyAuthToken } from "../utils/token.js";

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const admin = await Admin.findOne({ email: email.toLowerCase() }).select("+passwordHash");
  const genericError = () => new AppError("Invalid email or password", 401);

  if (!admin) throw genericError();

  const matches = await bcrypt.compare(password, admin.passwordHash);
  if (!matches) throw genericError();

  const csrf = generateCsrfToken();
  const token = signAuthToken({ adminId: admin._id.toString(), email: admin.email, csrf });

  res.cookie("token", token, authCookieOptions());
  res.json({ data: { email: admin.email, isAdmin: true, csrfToken: csrf } });
});

export const logout = asyncHandler(async (req, res) => {
  res.clearCookie("token", { ...authCookieOptions(), maxAge: undefined });
  res.json({ data: { loggedOut: true } });
});

export const me = asyncHandler(async (req, res) => {
  const token = req.cookies?.token;
  if (!token) return res.json({ data: { isAdmin: false } });

  try {
    const payload = verifyAuthToken(token);
    const admin = await Admin.findById(payload.sub);
    if (!admin) return res.json({ data: { isAdmin: false } });
    return res.json({ data: { isAdmin: true, email: admin.email, csrfToken: payload.csrf } });
  } catch {
    return res.json({ data: { isAdmin: false } });
  }
});
