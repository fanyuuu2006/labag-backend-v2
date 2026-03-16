import { Request, Response } from "express";
import { SupabaseUser } from "../../../types/user";
import { supabase } from "../../../configs/supabase";
import { LaBaG, Pattern, Payout } from "labag";
import { SupabaseSpin } from "../../../types/spins";
import { DEFAULT_SPIN_BET } from "../../../libs/spin";
import { MyResponse } from "../../../types";
import { SupabaseUserCoins } from "../../../types/user_coins";
import { SupabaseCoinTransaction } from "../../../types/coin_transactions";

export const getDefaultSpinBet = (_: Request, res: Response) => {
  const resp: MyResponse<number> = {
    data: DEFAULT_SPIN_BET,
    message: "預設轉盤投注金額取得成功",
  };
  res.json(resp);
};

export const postSpins = async (req: Request, res: Response) => {
  const user = req.user as SupabaseUser;

  const { data: userCoins, error: userCoinsError } = await supabase
    .from("user_coins")
    .select<"*", SupabaseUserCoins>("*")
    .eq("user_id", user.id)
    .single();

  if (userCoinsError || !userCoins) {
    const resp: MyResponse<null> = {
      data: null,
      message: userCoinsError?.message || "取得用戶餘額時發生錯誤",
    };
    res.status(500).json(resp);
    return;
  }

  if (userCoins.balance < DEFAULT_SPIN_BET) {
    const resp: MyResponse<null> = {
      data: null,
      message: "餘額不足，無法進行轉盤",
    };
    res.status(400).json(resp);
    return;
  }

  const { data: patterns, error: patternsError } = await supabase
    .from("patterns")
    .select<"*", Pattern>("*");

  if (patternsError || !patterns) {
    const resp: MyResponse<null> = {
      data: null,
      message: patternsError?.message || "取得圖案列表時發生錯誤",
    };
    res.status(500).json(resp);
    return;
  }

  const { data: payouts, error: payoutsError } = await supabase
    .from("payouts")
    .select<"*", Payout>("*");

  if (payoutsError || !payouts) {
    const resp: MyResponse<null> = {
      data: null,
      message: payoutsError?.message || "取得賠率列表時發生錯誤",
    };
    res.status(500).json(resp);
    return;
  }

  const labag = new LaBaG(patterns, payouts);
  const { reels, reward } = labag.spin();

  const spin: Omit<SupabaseSpin, "id" | "created_at"> = {
    user_id: user.id,
    reels,
    reward,
    bet: DEFAULT_SPIN_BET,
  };

  const { data, error } = await supabase
    .from("spins")
    .insert(spin)
    .select("*")
    .single();

  if (error || !data) {
    const resp: MyResponse<null> = {
      data: null,
      message: error?.message || "儲存轉盤結果時發生錯誤",
    };
    res.status(500).json(resp);
    return;
  }

  // 扣除用戶餘額並加上獎勵
  const newBalance = userCoins.balance - DEFAULT_SPIN_BET + reward;
  const { data: updatedUserCoins, error: updateUserCoinsError } = await supabase
    .from("user_coins")
    .update({
      balance: newBalance,
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", user.id)
    .select<"*", SupabaseUserCoins>("*")
    .single();

  if (updateUserCoinsError || !updatedUserCoins) {
    const resp: MyResponse<null> = {
      data: null,
      message: updateUserCoinsError?.message || "更新用戶餘額時發生錯誤",
    };
    res.status(500).json(resp);
    return;
  }
  const transactions: Omit<SupabaseCoinTransaction, "id" | "created_at">[] = [
    {
      user_id: user.id,
      amount: -DEFAULT_SPIN_BET,
      type: "bet",
      ref_id: data.id,
    },
  ];

  if (reward > 0) {
    transactions.push({
      user_id: user.id,
      amount: reward,
      type: "reward",
      ref_id: data.id,
    });
  }

  const { error: txError } = await supabase
    .from("coin_transactions")
    .insert(transactions);

  if (txError) {
    const resp: MyResponse<null> = {
      data: null,
      message: txError.message || "紀錄交易時發生錯誤",
    };
    res.status(500).json(resp);
    return;
  }

  const resp: MyResponse<{
    spin: SupabaseSpin;
    user_coins: SupabaseUserCoins;
  }> = {
    data: {
      spin: data as SupabaseSpin,
      user_coins: updatedUserCoins as SupabaseUserCoins,
    },
    message: "轉盤成功",
  };
  res.json(resp);
};

export const getSpinsById = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) {
    const resp: MyResponse<null> = {
      data: null,
      message: "用戶 ID 未提供",
    };
    res.status(400).json(resp);
    return;
  }

  const { data, error } = await supabase
    .from("spins")
    .select<"*", SupabaseSpin>("*")
    .eq("user_id", id)
    .order("created_at", { ascending: false });
  if (error) {
    const resp: MyResponse<SupabaseSpin[]> = {
      data: null,
      message: error.message || "取得轉盤紀錄時發生錯誤",
    };
    res.status(500).json(resp);
    return;
  }
  const resp: MyResponse<SupabaseSpin[]> = {
    data: data,
    message: "轉盤紀錄取得成功",
  };
  res.json(resp);
};
