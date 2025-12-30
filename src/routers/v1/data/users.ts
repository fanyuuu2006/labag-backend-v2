import { Router } from "express";
import { authMiddleware } from "../../../middlewares/auth";
import { getUsersProfile } from '../../../controllers/v1/data/users';

export const router = Router();
router.get("/profile", authMiddleware, getUsersProfile);