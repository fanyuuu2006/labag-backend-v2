import { supabase } from "../configs/supabase";
import { SupabaseCoinTransaction } from "../types/coin_transactions";

export const changeUserCoins = async ({
  user_id,
  amount,
  type,
}: Omit<SupabaseCoinTransaction, "id" | "created_at">) =>
  supabase.rpc("change_user_coins", {
    p_user_id: user_id,
    p_amount: amount,
    p_type: type,
  });
