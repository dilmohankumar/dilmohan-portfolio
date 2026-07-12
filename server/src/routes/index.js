import { Router } from "express";
import authRoutes from "./authRoutes.js";
import contentRoutes from "./contentRoutes.js";
import projectRoutes from "./projectRoutes.js";
import experienceRoutes from "./experienceRoutes.js";
import educationRoutes from "./educationRoutes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/", contentRoutes);
router.use("/projects", projectRoutes);
router.use("/experience", experienceRoutes);
router.use("/education", educationRoutes);

export default router;
