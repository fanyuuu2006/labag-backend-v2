import { Router } from "express";
import {
  getRecords,
  getRecordsByUserId,
  postRecords,
} from "../../../controllers/v1/data/records";
import { authMiddleware } from "../../../middlewares/auth";

export const router = Router();
router
  .get("/", getRecords)
  .get("/:user_id", getRecordsByUserId)
  .post("/", authMiddleware, postRecords);
