import { Router } from "express";
import { authMiddleware } from "../../../middlewares/auth";
import { postSpins } from "../../../controllers/v1/game/spins";

export const router = Router();
router.post("/", authMiddleware, postSpins);
