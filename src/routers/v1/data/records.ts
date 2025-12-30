import { Router } from "express";
import { getRecords } from "../../../controllers/v1/data/records";

export const router = Router();
router.get("/", getRecords);
