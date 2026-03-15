import { Request, Response } from "express";
import { SupabaseAllowFieldsUser, SupabaseUser } from "../../types/user";
import { MyResponse } from "../../types";
import { supabase } from "../../configs/supabase";
import { ALLOW_USER_FIELDS } from "../../libs";
import { SupabaseUserCoins } from "../../types/user_coins";
import { SupabaseStatsView } from "../../types/stats_view";

export const getUsers = async (_: Request, res: Response) => {
  const { data, error } = await supabase
    .from("users")
    .select<string, SupabaseAllowFieldsUser>(ALLOW_USER_FIELDS.join(", "));

  if (error) {
    const resp: MyResponse<SupabaseAllowFieldsUser[]> = {
      data: null,
      message: error.message || "取得用戶列表時發生錯誤",
    };
    res.status(500).json(resp);
    return;
  }
  const resp: MyResponse<SupabaseAllowFieldsUser[]> = {
    data: data,
    message: "用戶列表取得成功",
  };
  res.json(resp);
};

export const getUsersMe = (req: Request, res: Response) => {
  const user = req.user as SupabaseUser;
  const resp: MyResponse<SupabaseUser> = {
    data: user,
    message: "用戶資料取得成功",
  };
  res.json(resp);
};

export const getUserById = async (req: Request, res: Response) => {
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
    .from("users")
    .select(ALLOW_USER_FIELDS.join(", "))
    .eq("id", id)
    .single<SupabaseAllowFieldsUser>();
  if (error) {
    const resp: MyResponse<SupabaseAllowFieldsUser> = {
      data: null,
      message: "用戶不存在",
    };
    res.status(404).json(resp);
    return;
  }
  console.log(data);
  const resp: MyResponse<SupabaseAllowFieldsUser> = {
    data: data,
    message: "用戶資料取得成功",
  };
  res.json(resp);
};

export const getUserCoinsById = async (req: Request, res: Response) => {
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
    .from("user_coins")
    .select<"*", SupabaseUserCoins>("*")
    .eq("user_id", id)
    .single();
  if (error) {
    const resp: MyResponse<SupabaseUserCoins> = {
      data: null,
      message: "用戶餘額不存在",
    };
    res.status(404).json(resp);
    return;
  }
  const resp: MyResponse<SupabaseUserCoins> = {
    data: data,
    message: "用戶餘額取得成功",
  };
  res.json(resp);
};

export const getUserStatsById = async (req: Request, res: Response) => {
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
    .from("stats_view")
    .select<"*", SupabaseStatsView>("*")
    .eq("user_id", id)
    .single();
  if (error) {
    const resp: MyResponse<SupabaseStatsView> = {
      data: null,
      message: "用戶統計資料不存在",
    };
    res.status(404).json(resp);
    return;
  }
  const resp: MyResponse<SupabaseStatsView> = {
    data: data,
    message: "用戶統計資料取得成功",
  };
  res.json(resp);
};
