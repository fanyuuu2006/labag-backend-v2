export type SupabaseRecord = {
  id: number;
  created_at: string;
  score: number;
  user_id: number;
};

export type FrontendRecord = {
  times: number;
  score: number;
  rounds: { randNums: Record<string, number> }[];
};