import { Router } from "express";
import { router as spinsRouter } from "./game/spins";
import { router as patternsRouter } from "./game/patterns";
import { router as payoutsRouter } from "./game/payouts";

export const router = Router();
router
  .use("/spins", spinsRouter)
  .use("/patterns", patternsRouter)
  .use("/payouts", payoutsRouter);
