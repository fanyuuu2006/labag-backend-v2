import { Router } from "express";
import {
  signCallBackMiddleware,
  signInMiddleware,
} from "../../middlewares/sign";
import { signCallBack } from "../../controllers/v1/auth/sign";

export const router = Router();
router
  .get("/:signBy/callback", signCallBackMiddleware, signCallBack)

  .get("/:signBy", signInMiddleware);
