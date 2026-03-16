import { Pattern, Payout } from "labag";

export type PatternWithPayouts = Pattern & {
  probability: number; // 圖案出現的機率
  payouts: Payout[];
};
