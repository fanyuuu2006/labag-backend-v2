import { Router } from "express";
import { getPayouts } from "../../../controllers/v1/game/payouts";

export const router = Router();
router.get("/", getPayouts);
