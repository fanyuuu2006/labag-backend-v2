import { SupabaseRecord } from "./records";
import { SupabaseUser } from "./user";
export type SupabaseRankingViewItem = {
  user_id: SupabaseUser["id"];
  user_name: SupabaseUser["name"];
  score: SupabaseRecord["score"];
  record_id: SupabaseRecord["id"];
  created_at: SupabaseRecord["created_at"];
};
