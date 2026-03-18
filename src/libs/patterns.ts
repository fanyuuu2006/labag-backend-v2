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
  { id: "1", match_count: 2, pattern_id: "1", reward: 56 },
  { id: "2", match_count: 3, pattern_id: "1", reward: 242 },
  { id: "3", match_count: 2, pattern_id: "2", reward: 119 },
  { id: "4", match_count: 3, pattern_id: "2", reward: 578 },
  { id: "5", match_count: 2, pattern_id: "3", reward: 266 },
  { id: "6", match_count: 3, pattern_id: "3", reward: 1345 },
  { id: "7", match_count: 2, pattern_id: "4", reward: 571 },
  { id: "8", match_count: 3, pattern_id: "4", reward: 3503 },
  { id: "9", match_count: 2, pattern_id: "5", reward: 2136 },
  { id: "10", match_count: 3, pattern_id: "5", reward: 11727 },
  { id: "11", match_count: 2, pattern_id: "6", reward: 18707 },
  { id: "12", match_count: 3, pattern_id: "6", reward: 182200 },
];
