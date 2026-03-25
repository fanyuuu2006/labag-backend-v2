import { Pattern, Payout } from "../types/patterns";
import { randInt } from "./randInt";
export namespace LaBaG {
  export const spin = ({
    bet,
    patterns,
    payouts,
  }: {
    bet: number;
    patterns: Pattern[];
    payouts: Payout[];
  }): { reels: Pattern[]; reward: number; multiplier: number } => {
    // 預先計算 totalWeight，避免在每次抽樣都重複計算
    const totalWeight = patterns.reduce((sum, p) => sum + p.weight, 0);
    const reels = [
      randomPattern(patterns, totalWeight),
      randomPattern(patterns, totalWeight),
      randomPattern(patterns, totalWeight),
    ];
    const multiplier = calculateMultiplier(reels, payouts);
    const reward = Math.floor(bet * multiplier);
    return {
      reels,
      reward,
      multiplier,
    };
  };

  // 支援傳入 precomputed totalWeight，以減少重複計算
  const randomPattern = (patterns: Pattern[], totalWeight?: number): Pattern => {
    const tw = typeof totalWeight === "number"
      ? totalWeight
      : patterns.reduce((sum, pattern) => sum + pattern.weight, 0);
    const randNum = randInt(1, tw);
    let cumulativeWeight = 0;
    for (const pattern of patterns) {
      cumulativeWeight += pattern.weight;
      if (randNum <= cumulativeWeight) {
        return pattern;
      }
    }
    throw new Error("No pattern found");
  };

  const calculateMultiplier = (reels: Pattern[], payouts: Payout[]): number => {
    const patternCounts: { [key: string]: number } = {};
    for (const pattern of reels) {
      patternCounts[pattern.id] = (patternCounts[pattern.id] || 0) + 1;
    }

    const MIN_JITTER = -0.05;
    const MAX_JITTER = 0.05;

    let totalMultiplier = 0;
    for (let i = 0; i < payouts.length; i++) {
      const payout = payouts[i];
      if (patternCounts[payout.pattern_id] === payout.match_count) {
        const base = payout.multiplier;
        // 使用 Math.random 直接產生浮點數，避免字串轉換；四捨五入到 2 位小數
        const jitterRaw = Math.random() * (MAX_JITTER - MIN_JITTER) + MIN_JITTER;
        const jitter = Math.round(jitterRaw * 100) / 100;
        const varied = base * (1 + jitter);
        totalMultiplier += varied;
      }
    }
    return Math.max(0, totalMultiplier);
  };
}
