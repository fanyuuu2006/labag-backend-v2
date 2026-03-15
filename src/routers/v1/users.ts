import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth";
import {
  getUserById,
  getUsers,
  getUsersMe,
} from "../../controllers/v1/users";

export const router = Router();
router
  .get("/",  getUsers)
  .get("/me", authMiddleware, getUsersMe)
  .get("/:id", getUserById)
