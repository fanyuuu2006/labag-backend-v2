import { Router } from "express";
import { getStats, getStatsById } from "../../../controllers/v1/data/stats";

export const router = Router();
router.get("/", getStats);
router.get("/:id", getStatsById);