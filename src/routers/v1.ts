import { Router } from "express";
import { router as dataRouter } from "./v1/data";

export const router = Router();

router.use("/data", dataRouter);
