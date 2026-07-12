import crypto from "crypto";
import jwt from "jsonwebtoken";

export function generateCsrfToken() {
  return crypto.randomBytes(24).toString("hex");
}

export function signAuthToken({ adminId, email, csrf }) {
  return jwt.sign({ sub: adminId, email, csrf }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
}

export function verifyAuthToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}

export function cookieMaxAgeMs() {
  return 7 * 24 * 60 * 60 * 1000;
}

export function authCookieOptions() {
  const isProd = process.env.NODE_ENV === "production";
  return {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    maxAge: cookieMaxAgeMs(),
    path: "/",
  };
}
