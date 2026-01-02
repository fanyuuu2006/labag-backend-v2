import { Router } from "express";
import { router as recordsRouter } from "./data/records";
import { router as usersRouter } from "./data/users";
import { router as rankingRouter } from "./data/ranking";

export const router = Router();
router
  .use("/records", recordsRouter)
  .use("/users", usersRouter)
  .use("/ranking", rankingRouter);
