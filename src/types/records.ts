export type SupabaseRecord = {
  id: number; // primary key
  created_at: string;
  score: number;
  user_id: number;
  hash?: string;
};
