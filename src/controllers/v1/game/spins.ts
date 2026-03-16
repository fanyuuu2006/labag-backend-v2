import { Request, Response } from "express";
import { SupabaseUser } from "../../../types/user";
import { supabase } from "../../../configs/supabase";
import { LaBaG, Pattern, Payout } from "labag";
import { SupabaseSpin } from "../../../types/spins";
import { DEFAULT_SPIN_BET } from "../../../libs/spin";
import { MyResponse } from "../../../types";
import { SupabaseUserCoins } from "../../../types/user_coins";
import { SupabaseCoinTransaction } from "../../../types/coin_transactions";
import { changeUserCoins } from "../../../utils/user_coins";

export const getDefaultSpinBet = (_: Request, res: Response) => {
  const resp: MyResponse<number> = {
    data: DEFAULT_SPIN_BET,
    message: "預設轉盤投注金額取得成功",
  };
  res.json(resp);
};

export const postSpins = async (req: Request, res: Response) => {
  const user = req.user as SupabaseUser;

  const { error: betUserCoinsError } = await changeUserCoins({
    user_id: user.id,
    amount: -DEFAULT_SPIN_BET,
    type: "bet",
  });

  if (betUserCoinsError) {
    const resp: MyResponse<null> = {
      data: null,
      message: betUserCoinsError.message || "更新用戶餘額時發生錯誤",
    };
    res.status(500).json(resp);
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

  if (reward > 0) {
    const { error: rewardUserCoinsError } = await changeUserCoins({
      user_id: user.id,
      amount: reward,
      type: "reward",
    });

    if (rewardUserCoinsError) {
      const resp: MyResponse<null> = {
        data: null,
        message: rewardUserCoinsError.message || "更新用戶餘額時發生錯誤",
      };
      res.status(500).json(resp);
      return;
    }
  }

  const resp: MyResponse<SupabaseSpin> = {
    data,
    message: "轉盤遊戲完成",
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
