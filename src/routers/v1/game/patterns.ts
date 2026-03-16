import { Router } from "express";
import {
  getPatternById,
  getPatternPayoutsById,
  getPatterns,
} from "../../../controllers/v1/game/patterns";

export const router = Router();
router
  .get("/", getPatterns)
  .get("/:id", getPatternById)
  .get("/:id/payouts", getPatternPayoutsById);
