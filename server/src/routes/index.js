import { Router } from "express";
import authRoutes from "./authRoutes.js";
import contentRoutes from "./contentRoutes.js";
import projectRoutes from "./projectRoutes.js";
import experienceRoutes from "./experienceRoutes.js";
import educationRoutes from "./educationRoutes.js";
import sectionRoutes from "./sectionRoutes.js";
import uploadRoutes from "./uploadRoutes.js";

const router = Router();

router.get("/health", (req, res) => res.json({ data: { status: "ok" } }));

router.use("/auth", authRoutes);
router.use("/", contentRoutes);
router.use("/projects", projectRoutes);
router.use("/experience", experienceRoutes);
router.use("/education", educationRoutes);
router.use("/sections", sectionRoutes);
router.use("/uploads", uploadRoutes);

export default router;
