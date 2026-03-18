import { SupabaseUser } from "./user";

export type SupabaseShare = {
  id: string;
  user_id: SupabaseUser["id"];
  claim_at: string | null;
  created_at: string;
};
