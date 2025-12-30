import { Router } from "express";
import { router as recordsRouter } from "./data/records";
import { router as usersRouter } from "./data/users";

export const router = Router();
router.use("/records", recordsRouter).use("/users", usersRouter);
