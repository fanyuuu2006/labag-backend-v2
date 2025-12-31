import { NextFunction, Request, Response } from "express";
import { MyResponse } from "../types";
import { verifyToken } from "../utils/jwt";
import { supabase } from "../configs/supabase";
import { SupabaseUser } from "../types/user";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    const resp: MyResponse<null> = {
      data: null,
      message: "未提供授權標頭",
    };
    res.status(401).json(resp);
    return;
  }
  const token = authHeader.split(" ")[1];
  if (!token) {
    const resp: MyResponse<null> = {
      data: null,
      message: "授權標頭格式錯誤",
    };
    res.status(401).json(resp);
    return;
  }
  try {
    const { id } = verifyToken(token) as SupabaseUser;
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) {
      const resp: MyResponse<null> = {
        data: null,
        message: "無效的令牌或用戶不存在",
      };
      res.status(401).json(resp);
      return;
    }

    // 存到 req.user，供後續 API 使用
    req.user = data;
  } catch (error) {
    console.error(error);
    const resp: MyResponse<null> = {
      data: null,
      message: `伺服器錯誤: ${
        error instanceof Error ? error.message : String(error)
      }`,
    };
    res.status(401).json(resp);
    return;
  }
  next();
};
