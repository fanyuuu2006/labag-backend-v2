import { Router } from "express";
import { router as usersRouter } from "./v1/users";
import { router as authRouter } from "./v1/auth";
import { router as gameRouter } from "./v1/game";

export const router = Router();

router
  .use("/users", usersRouter)
  .use("/auth", authRouter)
  .use("/game", gameRouter);
