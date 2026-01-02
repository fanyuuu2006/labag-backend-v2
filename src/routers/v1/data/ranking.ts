import { Router } from "express";
import { getRanking } from "../../../controllers/v1/data/ranking";

export const router = Router();
router.get("/", getRanking);
