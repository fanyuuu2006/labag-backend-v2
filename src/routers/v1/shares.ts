import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth";
import { getSharesById, postShares } from "../../controllers/v1/shares";

export const router = Router();
router.post("/", authMiddleware, postShares);
router.get("/:id", getSharesById);
