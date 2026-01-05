import { SupabaseUser } from "../types/user";
import { SupabaseUserStatsViewItem } from "../types/user_stats_view";

export const ALLOW_USER_FIELDS = [
  "id",
  "created_at",
  "name",
  "avatar",
] satisfies readonly (keyof SupabaseUser)[];

export const VALID_KEYS = [
  "play_count",
  "highest_score",
] satisfies readonly (keyof SupabaseUserStatsViewItem)[];
