import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth";
import { getUsers } from "../../controllers/v1/users";
import { router as meRouter } from "./users/me";
import { router as idRouter } from "./users/[id]";

export const router = Router();
router
  .get("/", getUsers)
  .use("/me", authMiddleware, meRouter)
  .use("/:id", idRouter);
