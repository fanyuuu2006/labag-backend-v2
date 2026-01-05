import { Router } from "express";
import { getStats, getStatsByKey } from "../../../controllers/v1/data/stats";

export const router = Router();
router.get("/", getStats).get("/:key", getStatsByKey);
