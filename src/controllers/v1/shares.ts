import { Request, Response } from "express";
import { MyResponse } from "../../types";
import { supabase } from "../../configs/supabase";
import { SupabaseUser } from "../../types/user";
import { SupabaseShare } from "../../types/shares";
import { changeUserCoins } from "../../utils/supabase";

export const postShares = async (req: Request, res: Response) => {
  const user = req.user as SupabaseUser;
  if (!user) {
    const resp: MyResponse<null> = {
      data: null,
      message: "未授權的請求，請先登入",
    };
    res.status(401).json(resp);
    return;
  }

  const { data, error } = await supabase
    .from("shares")
    .insert({ user_id: user.id })
    .select<"*", SupabaseShare>("*")
    .single();

  if (error || !data) {
    const resp: MyResponse<null> = {
      data: null,
      message: error?.message || "分享連結生成失敗",
    };
    res.status(500).json(resp);
    return;
  }

  const resp: MyResponse<SupabaseShare> = {
    data,
    message: "分享連結生成成功",
  };
  res.json(resp);
};

// 驗證分享連結並且發放金幣export const getSharesById = async (req: Request, res: Response) => {
export const getSharesById = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    const resp: MyResponse<null> = {
      data: null,
      message: "請提供有效的分享 ID",
    };
    res.status(400).json(resp);
    return;
  }

  // 1️⃣ 查找尚未領取的分享
  const { data: share, error } = await supabase
    .from("shares")
    .select<"*", SupabaseShare>("*")
    .eq("id", id)
    .is("claim_at", null) // 確保還沒被領取
    .single();

  if (error || !share) {
    const resp: MyResponse<null> = {
      data: null,
      message: error?.message || "找不到有效的分享連結或已領取",
    };
    res.status(404).json(resp);
    return;
  }

  try {
    // 2️⃣ 發放金幣給分享者
    const { error: coinError } = await changeUserCoins({
      user_id: share.user_id,
      amount: 1, // 這裡可自訂金幣數量
      type: "shares",
    });

    if (coinError) {
      throw new Error(coinError.message);
    }

    // 3️⃣ 標記分享已被領取
    const { error: updateError } = await supabase
      .from("shares")
      .update({ claim_at: new Date().toISOString() })
      .eq("id", id);

    if (updateError) {
      throw new Error(updateError.message);
    }

    const resp: MyResponse<SupabaseShare> = {
      data: share,
      message: "金幣已發放！分享已領取",
    };
    res.json(resp);
  } catch (err: any) {
    const resp: MyResponse<null> = {
      data: null,
      message: err.message || "發放金幣失敗",
    };
    res.status(500).json(resp);
  }
};
