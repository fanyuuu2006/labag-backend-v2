import { Request, Response } from "express";
import { SupabaseUser } from "../../../types/user";
import { supabase } from "../../../configs/supabase";
import { LaBaG, Pattern, Payout } from "labag";
import { SupabaseSpin } from "../../../types/spins";
import { DEFAULT_SPIN_BET } from "../../../libs/spin";
import { MyResponse } from "../../../types";

export const postSpins = async (req: Request, res: Response) => {
  const user = req.user as SupabaseUser;
  const { data: patterns, error: patternsError } = await supabase
    .from("patterns")
    .select<"*", Pattern>("*");

  if (patternsError || !patterns) {
    res.status(500).json({
      data: null,
      message: patternsError?.message || "取得圖案列表時發生錯誤",
    });
    return;
  }

  const { data: payouts, error: payoutsError } = await supabase
    .from("payouts")
    .select<"*", Payout>("*");

  if (payoutsError || !payouts) {
    res.status(500).json({
      data: null,
      message: payoutsError?.message || "取得賠率列表時發生錯誤",
    });
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

  const resp: MyResponse<SupabaseSpin> = {
    data: data,
    message: "轉盤成功",
  };
  res.json(resp);
};
