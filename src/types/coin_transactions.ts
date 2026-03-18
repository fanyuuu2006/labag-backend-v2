import { SupabaseUser } from "./user";

export type SupabaseCoinTransaction = {
  id: number; // primary key
  created_at: string;
  user_id: SupabaseUser["id"]; // foreign key to SupabaseUser.id
  amount: number;
  type: 'bet' | 'reward' |  'init' | 'admin' | 'shares'; // example types of transactions
};
