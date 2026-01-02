import { SupabaseUser } from "./user";

export type SupabaseUserStatsViewItem = {
    user_id: SupabaseUser["id"];
    play_count: number;
    highest_score: number;
}