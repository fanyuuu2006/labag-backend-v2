import { Pattern, Payout } from "labag";

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
  { id: "1", match_count: 2, pattern_id: "1", multiplier: 0.28 },
  { id: "2", match_count: 3, pattern_id: "1", multiplier: 1.21 },
  { id: "3", match_count: 2, pattern_id: "2", multiplier: 0.6 },
  { id: "4", match_count: 3, pattern_id: "2", multiplier: 2.89 },
  { id: "5", match_count: 2, pattern_id: "3", multiplier: 1.33 },
  { id: "6", match_count: 3, pattern_id: "3", multiplier: 6.73 },
  { id: "7", match_count: 2, pattern_id: "4", multiplier: 2.86 },
  { id: "8", match_count: 3, pattern_id: "4", multiplier: 17.52 },
  { id: "9", match_count: 2, pattern_id: "5", multiplier: 10.68 },
  { id: "10", match_count: 3, pattern_id: "5", multiplier: 58.64 },
  { id: "11", match_count: 2, pattern_id: "6", multiplier: 93.54 },
  { id: "12", match_count: 3, pattern_id: "6", multiplier: 911.0 },
];
