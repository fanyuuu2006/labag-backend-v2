import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth";
import { router as meRouter } from "./users/me";
import { router as idRouter } from "./users/[id]";

export const router = Router();
router
  .use("/me", authMiddleware, meRouter)
  .use("/:id", idRouter);
