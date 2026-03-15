import { Router } from "express";
import { getPatterns } from "../../../controllers/v1/game/patterns";

export const router = Router();
router.get("/", getPatterns);
