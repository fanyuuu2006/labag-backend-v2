import { SupabaseUser } from "./user";
import { SupabaseUserCoins } from "./user_coins";

export type SupabaseStatsView = {
  user_id: SupabaseUser["id"];
  play_count: number;
  user_coins: SupabaseUserCoins["balance"];
};
