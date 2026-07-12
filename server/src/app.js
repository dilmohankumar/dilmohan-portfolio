import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import mongoSanitize from "express-mongo-sanitize";
import helmet from "helmet";
import morgan from "morgan";

import routes from "./routes/index.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { notFound } from "./middleware/notFound.js";
import { globalApiLimiter } from "./middleware/rateLimiter.js";

const app = express();

app.set("trust proxy", 1);

const isProd = process.env.NODE_ENV === "production";
const localDevOriginPattern = /^http:\/\/localhost:5\d{3}$/;

app.use(helmet());
app.use(
  cors({
    // In production, lock to the exact configured origin. In development, allow any
    // localhost:5xxx port — Vite bumps ports when one is already taken, and re-editing
    // CLIENT_ORIGIN every time that happens is needless friction for local dev.
    origin: isProd
      ? process.env.CLIENT_ORIGIN
      : (origin, callback) => {
          if (!origin || localDevOriginPattern.test(origin)) return callback(null, true);
          callback(new Error("Not allowed by CORS"));
        },
    credentials: true,
  })
);
app.use(express.json({ limit: "10kb" }));
app.use(cookieParser());
app.use(mongoSanitize());
app.use(compression());
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

app.get("/health", (req, res) => res.json({ data: { status: "ok" } }));

app.use("/api", globalApiLimiter, routes);

app.use(notFound);
app.use(errorHandler);

export default app;
