import { Router } from "express";
import {
  getUserById,
  getUserCoinsById,
  getUserSpinsById,
  getUserStatsById,
} from "../../../controllers/v1/users";
export const router = Router({ mergeParams: true });
router
  .get("/", getUserById)
  .get("/coins", getUserCoinsById)
  .get("/stats", getUserStatsById)
  .get("/spins", getUserSpinsById);
