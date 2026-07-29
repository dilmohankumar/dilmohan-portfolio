import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { Router } from "express";
import multer from "multer";
import { requireAuth } from "../middleware/auth.js";
import { AppError } from "../utils/AppError.js";

// server/uploads — resolved from this file so it doesn't depend on the process cwd.
export const UPLOADS_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../uploads");
fs.mkdirSync(UPLOADS_DIR, { recursive: true });

const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/webp", "image/gif", "image/avif"];

const storage = multer.diskStorage({
  destination: UPLOADS_DIR,
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase() || ".png";
    cb(null, `${req.user.id}-${Date.now()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 4 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!ALLOWED_TYPES.includes(file.mimetype)) {
      return cb(new AppError("Only PNG, JPG, WEBP, GIF or AVIF images are allowed", 400));
    }
    cb(null, true);
  },
});

const router = Router();

router.post("/", requireAuth, (req, res, next) => {
  upload.single("image")(req, res, (err) => {
    if (err) {
      const message = err instanceof multer.MulterError && err.code === "LIMIT_FILE_SIZE" ? "Image must be 4MB or smaller" : err.message;
      return next(err instanceof AppError ? err : new AppError(message, 400));
    }
    if (!req.file) return next(new AppError("No image file provided", 400));
    res.status(201).json({
      data: { url: `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}` },
    });
  });
});

export default router;
