import { Request, Response } from "express";
import { SignOptions, SignUser, SupabaseUser } from "../../../types/user";
import { MyResponse } from "../../../types";
import { supabase } from "../../../configs/supabase";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../../../utils/jwt";
import { FRONTEND_URL } from "../../../libs/env";

export const signCallBack = async (req: Request, res: Response) => {
  const signBy = req.params.signBy as SignOptions;
  const user = req.user as SignUser;
  if (!req.user) {
    const resp: MyResponse<null> = {
      data: null,
      message: `${signBy} 登入失敗：無法取得用戶資訊`,
    };
    res.status(401).json(resp);
    return;
  }
  const sbUser: Omit<SupabaseUser, "id" | "created_at"> = {
    name: user.displayName,
    provider_id: `${signBy}-${user.id}`,
    email: user.emails?.[0]?.value,
    avatar: user.photos?.[0]?.value,
  };
  try {
    const { data, error } = await supabase
      .from("users")
      .upsert([sbUser], { onConflict: "provider_id" })
      .select()
      .single();

    if (error) {
      console.log(`Supabase 錯誤：${error.message}`);
      res.redirect(`${FRONTEND_URL}`);
      return;
    }

    const accessToken = generateAccessToken(data);
    const refreshToken = generateRefreshToken(data);
    console.log(`${signBy}登入成功`);
    res.redirect(
      `${FRONTEND_URL}/login-success?accessToken=${accessToken}&refreshToken=${refreshToken}`,
    );
  } catch (error) {
    console.error(error);
    res.redirect(`${FRONTEND_URL}`);
    return;
  }
};

export const refreshAccessToken = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    const resp: MyResponse<null> = {
      data: null,
      message: "請提供 Refresh Token",
    };
    res.status(401).json(resp);
    return;
  }

  try {
    const decoded = verifyRefreshToken(refreshToken) as SupabaseUser;

    // 從 Supabase 重新獲取使用者資訊比較安全
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", decoded.id)
      .single();

    if (error || !data) {
      const resp: MyResponse<null> = {
        data: null,
        message: "Refresh Token 無效或用戶不存在",
      };
      res.status(403).json(resp);
      return;
    }

    const newAccessToken = generateAccessToken(data, "15m");
    const newRefreshToken = generateRefreshToken(data, "30d");

    const resp: MyResponse<{ accessToken: string; refreshToken: string }> = {
      data: { accessToken: newAccessToken, refreshToken: newRefreshToken },
      message: "成功刷新 Access Token",
    };
    res.status(200).json(resp);
  } catch (error) {
    const resp: MyResponse<null> = {
      data: null,
      message: "Refresh Token 無效",
    };
    res.status(403).json(resp);
  }
};
