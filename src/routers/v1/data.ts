import { Router } from "express";
import { router as recordsRouter } from "./data/records";

export const router = Router();
router.use("/records", recordsRouter);