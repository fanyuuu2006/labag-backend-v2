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