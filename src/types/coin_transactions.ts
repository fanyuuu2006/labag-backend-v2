import { SupabaseUser } from "./user";

export type SupabaseCoinTransaction = {
  id: number; // primary key
  created_at: string;
  user_id: SupabaseUser["id"]; // foreign key to SupabaseUser.id
  amount: number;
  type: 'bet' | 'reward'; // example types of transactions
  ref_id: number; // optional reference ID for related records (e.g., spin ID)
};
