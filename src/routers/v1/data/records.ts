import { Router } from "express";
import { getRecords, postRecords } from "../../../controllers/v1/data/records";
import { authMiddleware } from "../../../middlewares/auth";

export const router = Router();
router.get("/", getRecords).post("/", authMiddleware, postRecords);
