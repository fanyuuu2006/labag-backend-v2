export type SupabaseRecord = {
  id: number;
  created_at: string;
  score: number;
  user_id: number;
};

export type FrontendRecord = {
    score: number;
    rounds: Record<string, number>[];
};