import { SupabaseStatsView } from "../types/stats_view";
import { SupabaseUser } from "../types/user";

export const ALLOW_USER_FIELDS = [
  "id",
  "created_at",
  "name",
  "avatar",
] satisfies readonly (keyof SupabaseUser)[];


export const VALID_STATS_KEYS = [
  "play_count",
  'user_coins',
] satisfies readonly (keyof SupabaseStatsView)[];

import { Pattern, Payout } from "../types/patterns";

export const patterns: Pattern[] = [
  {
    id: "1",
    weight: 36,
    image:
      "https://fanyu.vercel.app/api/album/item/1mDK1ewfLiV3fAB1HbjvwdSaDTdJdBGG3",
  },
  {
    id: "2",
    weight: 24,
    image:
      "https://fanyu.vercel.app/api/album/item/1oB-uZhPPfjfTtG4CITnb3_E-Ops9JTA0",
  },

  {
    id: "3",
    weight: 17,
    image:
      "https://fanyu.vercel.app/api/album/item/1bMJdRB8uerQZfGYINzBI9Vaw32bZljl2",
  },
  {
    id: "4",
    weight: 12,
    image:
      "https://fanyu.vercel.app/api/album/item/1In8LF1wVfLXpPkp57a20zX84QgsAeLQx",
  },

  {
    id: "5",
    weight: 8,
    image:
      "https://fanyu.vercel.app/api/album/item/1Zo_PjrXm-4TBrL2cLAeFkEl1el9kTR56",
  },
  {
    id: "6",
    weight: 3,
    image:
      "https://fanyu.vercel.app/api/album/item/19NMnVgcb-9IsknNcfe9TpCyPBIcGnhQU",
  },
];

export const payouts: Payout[] = [
  { id: "1", match_count: 2, pattern_id: "1", multiplier: 0.65 },
  { id: "2", match_count: 3, pattern_id: "1", multiplier: 3.1 },
  { id: "3", match_count: 2, pattern_id: "2", multiplier: 1.0 },
  { id: "4", match_count: 3, pattern_id: "2", multiplier: 8.6 },
  { id: "5", match_count: 2, pattern_id: "3", multiplier: 1.4 },
  { id: "6", match_count: 3, pattern_id: "3", multiplier: 19.0 },
  { id: "7", match_count: 2, pattern_id: "4", multiplier: 2.0 },
  { id: "8", match_count: 3, pattern_id: "4", multiplier: 35.0 },
  { id: "9", match_count: 2, pattern_id: "5", multiplier: 2.5 },
  { id: "10", match_count: 3, pattern_id: "5", multiplier: 50.65 },
  { id: "11", match_count: 2, pattern_id: "6", multiplier: 6.0 },
  { id: "12", match_count: 3, pattern_id: "6", multiplier: 1000.0 },
];
