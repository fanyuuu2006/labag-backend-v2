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
    const reels = [
      randomPattern(patterns),
      randomPattern(patterns),
      randomPattern(patterns),
    ];
    const multiplier = calculateMultiplier(reels, payouts);
    const reward = Math.floor(bet * multiplier);
    return {
      reels,
      reward,
      multiplier,
    };
  };

  const randomPattern = (patterns: Pattern[]): Pattern => {
    const totalWeight = patterns.reduce(
      (sum, pattern) => sum + pattern.weight,
      0,
    );
    const randNum = randInt(1, totalWeight);
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

    let totalMultiplier = 0;
    for (const payout of payouts) {
      if (patternCounts[payout.pattern_id] === payout.match_count) {
        totalMultiplier += payout.multiplier;
      }
    }
    return totalMultiplier;
  };
}
