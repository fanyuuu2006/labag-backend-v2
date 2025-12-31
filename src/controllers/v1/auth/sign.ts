import { Request, Response } from "express";
import { SignOptions, SignUser, SupabaseUser } from "../../../types/user";
import { MyResponse } from "../../../types";
import { supabase } from "../../../configs/supabase";
import { generateToken } from "../../../utils/jwt";
import { FRONTEND_URL } from "../../../libs/env";

export const signCallBack = async (req: Request, res: Response) => {
  const signBy = req.params.signBy as SignOptions;
  const user = req.user as SignUser;
  if (!req.user) {
    const resp: MyResponse<null> = {
      data: null,
      message: `${signBy} 登入失敗：未取得用戶資訊`,
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
      const resp: MyResponse<null> = {
        data: null,
        message: `Supabase 錯誤：${error.message}`,
      };
      res.status(500).json(resp);
      return;
    }

    const token = generateToken(data, "24h");
    console.log(`${signBy}登入成功`);
    res.redirect(`${FRONTEND_URL}/login-success?token=${token}`);
  } catch (error) {
    console.error(error);
    const resp: MyResponse<null> = {
      data: null,
      message: `伺服器錯誤: ${
        error instanceof Error ? error.message : String(error)
      }`,
    };
    res.status(500).json(resp);
    return;
  }
};
