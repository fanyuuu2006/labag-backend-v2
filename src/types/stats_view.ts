import { SupabaseUser } from "./user";
import { SupabaseUserCoins } from "./user_coins";

export type SupabaseStatsView = {
  user_id: SupabaseUser["id"];
  user_name: SupabaseUser["name"];
  play_count: number;
  user_coins: SupabaseUserCoins["balance"];
};
