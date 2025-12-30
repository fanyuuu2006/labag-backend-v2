import { Router } from "express";
import { router as dataRouter } from "./v1/data";
import { router as authRouter } from "./v1/auth";

export const router = Router();

router.use("/data", dataRouter);
router.use("/auth", authRouter);
