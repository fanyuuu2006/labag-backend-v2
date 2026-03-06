import { Router } from "express";
import {
  signCallBackMiddleware,
  signInMiddleware,
} from "../../middlewares/sign";
import {
  signCallBack,
  refreshAccessToken,
} from "../../controllers/v1/auth/sign";

export const router = Router();
router
  .post("/refresh", refreshAccessToken)
  .get("/:signBy", signInMiddleware)
  .get("/:signBy/callback", signCallBackMiddleware, signCallBack);
