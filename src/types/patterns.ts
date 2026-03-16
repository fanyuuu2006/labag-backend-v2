import { Pattern, Payout } from "labag";

export type PatternWithPayouts = Pattern & {
  payouts: Payout[];
};
