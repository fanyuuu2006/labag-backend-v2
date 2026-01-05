import { SupabaseUser } from "./user";

export type SupabaseUserStatsViewItem = {
  user_id: SupabaseUser["id"];
  user_name: SupabaseUser["name"];
  play_count: number;
  highest_score: number;
};
