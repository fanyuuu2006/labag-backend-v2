import { Pattern } from "labag";
import { SupabaseUser } from "./user";

export type SupabaseSpin = {
  id: number; // primary key
  created_at: string;
  user_id: SupabaseUser["id"];
  bet: number;
  reward: number;
  reels: Pattern[];
};
