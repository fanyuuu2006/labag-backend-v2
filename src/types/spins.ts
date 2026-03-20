import { Pattern } from "./patterns";
import { SupabaseUser } from "./user";

export type SupabaseSpin = {
  id: number; // primary key
  created_at: string;
  user_id: SupabaseUser["id"];
  bet: number;
  reward: number;
  reels: Pattern[];
  multiplier: number;
};
