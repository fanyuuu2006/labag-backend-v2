import { Router } from "express";
import { getUsersMe } from "../../../controllers/v1/users";

export const router = Router();
router.get("/", getUsersMe);
