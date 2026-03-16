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
    message: "成功取得預設投注金額",
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
      message: betUserCoinsError.message || "扣除投注金額失敗",
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
      message: patternsError?.message || "無法載入遊戲圖案配置",
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
      message: payoutsError?.message || "無法載入遊戲賠率配置",
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
      message: error?.message || "遊戲結果存檔失敗",
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
        message: rewardUserCoinsError.message || "派發獎勵失敗，請聯繫管理員",
      };
      res.status(500).json(resp);
      return;
    }
  }

  const resp: MyResponse<SupabaseSpin> = {
    data,
    message: "遊戲回合完成",
  };
  res.json(resp);
};

export const getSpinsById = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) {
    const resp: MyResponse<null> = {
      data: null,
      message: "請提供有效的紀錄 ID",
    };
    res.status(400).json(resp);
    return;
  }

  const { data, error } = await supabase
    .from("spins")
    .select<"*", SupabaseSpin>("*")
    .eq("id", id);
    
  if (error) {
    const resp: MyResponse<SupabaseSpin[]> = {
      data: null,
      message: error.message || "無法取得遊戲紀錄",
    };
    res.status(500).json(resp);
    return;
  }
  const resp: MyResponse<SupabaseSpin[]> = {
    data: data,
    message: "成功取得遊戲紀錄",
  };
  res.json(resp);
};
