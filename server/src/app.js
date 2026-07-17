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

app.use(helmet());
app.use(
  cors({
    // Reflect whatever origin made the request (this is a public single-admin API, not a
    // multi-tenant service with per-origin trust boundaries) so local dev, the deployed
    // frontend, and any future domain/port all work without editing CLIENT_ORIGIN each time.
    // Mutating requests are still gated by the CSRF token check in requireAuth, not by CORS.
    origin: (origin, callback) => callback(null, true),
    credentials: true,
  })
);
app.use(express.json({ limit: "50kb" }));
app.use(cookieParser());
app.use(mongoSanitize());
app.use(compression());
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

app.get("/health", (req, res) => res.json({ data: { status: "ok" } }));

app.use("/api", globalApiLimiter, routes);

app.use(notFound);
app.use(errorHandler);

export default app;
