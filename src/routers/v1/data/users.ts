import { Router } from "express";
import { authMiddleware } from "../../../middlewares/auth";
import {
  getRecordsByUserId,
  getStatsByUserId,
  getUserById,
  getUsersMe,
} from "../../../controllers/v1/data/users";

export const router = Router();
router
  .get("/me", authMiddleware, getUsersMe)
  .get("/:id", getUserById)
  .get("/:id/records", getRecordsByUserId)
  .get("/:id/stats", getStatsByUserId);
