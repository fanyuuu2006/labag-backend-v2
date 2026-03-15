import { SupabaseUser } from "./user";

export type SupabaseUserCoins = {
  user_id: SupabaseUser["id"]; // primary key and foreign key to SupabaseUser.id
  updated_at: string;
  balance: number;
};
