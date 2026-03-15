import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth";

export const router = Router();
router.post("/spin", authMiddleware, (req, res) => {});
