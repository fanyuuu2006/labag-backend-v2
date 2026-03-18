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

// 驗證分享連結並且發放金幣
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

  try {
    // 1️⃣ 嘗試領取分享 (Check-And-Update / 原子操作)
    // 這樣可以避免 Race Condition (並發請求重複領取)
    const { data: share, error: updateError } = await supabase
      .from("shares")
      .update({ claim_at: new Date().toISOString() })
      .eq("id", id)
      .is("claim_at", null) // 確保還沒被領取
      .select<"*", SupabaseShare>("*")
      .single();

    if (updateError || !share) {
      const resp: MyResponse<null> = {
        data: null,
        message: "無效的分享連結或已領取",
      };
      res.status(404).json(resp);
      return;
    }

    // 2️⃣ 發放金幣給分享者
    const { error: coinError } = await changeUserCoins({
      user_id: share.user_id,
      amount: 1,
      type: "shares",
    });

    if (coinError) {
      console.error("Coin error:", coinError);
      // 嘗試回滾分享狀態
      await supabase
        .from("shares")
        .update({ claim_at: null })
        .eq("id", id);

      throw new Error(coinError.message || "金幣發放失敗");
    }

    const resp: MyResponse<SupabaseShare> = {
      data: share,
      message: "金幣已發放！分享已領取",
    };
    res.json(resp);
  } catch (err: any) {
    const resp: MyResponse<null> = {
      data: null,
      message: err.message || "處理失敗",
    };
    res.status(500).json(resp);
  }
};
