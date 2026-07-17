import bcrypt from "bcryptjs";
import { Section } from "../models/Section.js";
import { SiteContent } from "../models/SiteContent.js";
import { User } from "../models/User.js";
import { AppError } from "../utils/AppError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { authCookieOptions, generateCsrfToken, signAuthToken, verifyAuthToken } from "../utils/token.js";

export const login = asyncHandler(async (req, res) => {
  // Trimmed defensively — copy-pasting credentials from a .env file commonly drags in a
  // stray trailing space/newline, which would otherwise silently fail bcrypt.compare below.
  const email = (req.body.email || "").trim().toLowerCase();
  const password = (req.body.password || "").trim();

  const user = await User.findOne({ email }).select("+passwordHash");
  const genericError = () => new AppError("Invalid email or password", 401);

  if (!user) throw genericError();

  const matches = await bcrypt.compare(password, user.passwordHash);
  if (!matches) throw genericError();

  const csrf = generateCsrfToken();
  const token = signAuthToken({ adminId: user._id.toString(), email: user.email, csrf });

  res.cookie("token", token, authCookieOptions());
  res.json({ data: { email: user.email, username: user.username, isAdmin: true, csrfToken: csrf } });
});

export const register = asyncHandler(async (req, res) => {
  const name = (req.body.name || "").trim();
  const email = (req.body.email || "").trim().toLowerCase();
  const username = (req.body.username || "").trim().toLowerCase();
  const password = (req.body.password || "").trim();

  if (await User.findOne({ email })) throw new AppError("An account with this email already exists", 409);
  if (await User.findOne({ username })) throw new AppError("This username is already taken", 409);

  const passwordHash = await bcrypt.hash(password, Number(process.env.BCRYPT_SALT_ROUNDS) || 12);
  const user = await User.create({ name, email, username, passwordHash });

  // Seed a minimal starter portfolio so /u/:username renders something reasonable
  // immediately, instead of a blank/broken page before the user edits anything.
  await SiteContent.create({
    userId: user._id,
    name: name || username,
    bio: "Welcome to my portfolio — I'm just getting started!",
    contact: { email: user.email },
  });
  await Section.insertMany([
    { userId: user._id, type: "hero", title: "", order: 0, builtIn: true },
    { userId: user._id, type: "contact", title: "Contact", order: 1, builtIn: true },
  ]);

  const csrf = generateCsrfToken();
  const token = signAuthToken({ adminId: user._id.toString(), email: user.email, csrf });

  res.cookie("token", token, authCookieOptions());
  res.status(201).json({ data: { email: user.email, username: user.username, isAdmin: true, csrfToken: csrf } });
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
    const user = await User.findById(payload.sub);
    if (!user) return res.json({ data: { isAdmin: false } });
    return res.json({ data: { isAdmin: true, email: user.email, username: user.username, csrfToken: payload.csrf } });
  } catch {
    return res.json({ data: { isAdmin: false } });
  }
});
