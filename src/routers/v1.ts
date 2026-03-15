import { Router } from "express";
import { router as usersRouter } from "./v1/users";
import { router as authRouter } from "./v1/auth";

export const router = Router();

router.use("/users", usersRouter);
router.use("/auth", authRouter);
