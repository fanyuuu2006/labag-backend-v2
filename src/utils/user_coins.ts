import { PostgrestError } from "@supabase/supabase-js";
import { supabase } from "../configs/supabase";
import { SupabaseCoinTransaction } from "../types/coin_transactions";

// 定義輸入類型，排除自動生成的欄位
type ChangeUserCoinsInput = Omit<SupabaseCoinTransaction, "id" | "created_at">;

export const changeUserCoins = async (
  data: ChangeUserCoinsInput,
): Promise<{ error: null | PostgrestError | Error }> => {
  const { user_id, amount, ...transaction } = data;

  // 1. 取得當前餘額 (只選取需要的欄位以優化效能)
  const { data: userCoins, error: userCoinsError } = await supabase
    .from("user_coins")
    .select<"balance", { balance: number }>("balance")
    .eq("user_id", user_id)
    .maybeSingle();

  if (userCoinsError) {
    return { error: userCoinsError };
  }

  if (!userCoins) {
    if (amount < 0) {
      return { error: new Error("用戶不存在且金額為負，無法進行操作") };
    }
    const { error: insertError } = await supabase.from("user_coins").insert({
      user_id,
      balance: amount,
      updated_at: new Date().toISOString(),
    });

    if (insertError) {
      return { error: insertError };
    }
  } else {
    // 2. 餘額檢查 (針對扣除操作)
    const currentBalance = userCoins.balance;
    if (amount < 0 && currentBalance + amount < 0) {
      return { error: new Error("餘額不足，無法進行操作") };
    }

    // 3. 更新餘額
    const newBalance = currentBalance + amount;
    // 注意：這裡使用 updated_at 以符合常見命名慣例，並假設型別定義正確
    const { error: updateError } = await supabase
      .from("user_coins")
      .update({
        balance: newBalance,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", user_id);

    if (updateError) {
      return { error: updateError };
    }
  }

  // 4. 紀錄交易
  const { error: transactionError } = await supabase
    .from("coin_transactions")
    .insert({
      user_id,
      amount,
      ...transaction,
    });

  if (transactionError) {
    // 雖然餘額已更新但記錄失敗，這是一個潛在的數據一致性問題
    // 在無由後端控制的 DB Transaction 情況下，僅能回傳錯誤
    return { error: transactionError || new Error("紀錄交易時發生錯誤") };
  }

  return { error: null };
};
