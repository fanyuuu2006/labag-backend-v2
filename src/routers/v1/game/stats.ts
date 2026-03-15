import { Router } from "express";
import { getStats, getStatsByKey } from "../../../controllers/v1/game/stats";

export const router = Router();
router.get("/", getStats);
router.get("/:key", getStatsByKey);
