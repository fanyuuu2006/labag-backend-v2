import { Router } from "express";
import { authMiddleware } from "../../../middlewares/auth";
import {
    getRecordsByUserId,
  getUserById,
  getUsersProfile,
} from "../../../controllers/v1/data/users";

export const router = Router();
router
  .get("/profile", authMiddleware, getUsersProfile)
  .get("/:id", getUserById)
  .get("/:id/records", getRecordsByUserId);
