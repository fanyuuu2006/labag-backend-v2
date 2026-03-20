export type Pattern = {
  id: string;
  weight: number;
  image: string;
};

export type Payout = {
  id: string;
  pattern_id: Pattern["id"];
  match_count: number;
  multiplier: number;
};


export type PatternWithPayouts = Pattern & {
  probability: number; // 圖案出現的機率
  payouts: Payout[];
};
