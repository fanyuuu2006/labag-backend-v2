import { Request, Response } from "express";
import { SupabaseAllowFieldsUser, SupabaseUser } from "../../types/user";
import { MyResponse } from "../../types";
import { supabase } from "../../configs/supabase";
import { ALLOW_USER_FIELDS } from "../../libs";
import { SupabaseUserCoins } from "../../types/user_coins";
import { SupabaseStatsView } from "../../types/stats_view";
import { SupabaseSpin } from "../../types/spins";

export const getUsers = async (_: Request, res: Response) => {
  const { data, error } = await supabase
    .from("users")
    .select<string, SupabaseAllowFieldsUser>(ALLOW_USER_FIELDS.join(", "));

  if (error) {
    const resp: MyResponse<SupabaseAllowFieldsUser[]> = {
      data: null,
      message: error.message || "無法取得用戶列表",
    };
    res.status(500).json(resp);
    return;
  }
  const resp: MyResponse<SupabaseAllowFieldsUser[]> = {
    data: data,
    message: "成功取得用戶列表",
  };
  res.json(resp);
};

export const getUsersMe = (req: Request, res: Response) => {
  const user = req.user as SupabaseUser;
  const resp: MyResponse<SupabaseUser> = {
    data: user,
    message: "成功取得用戶資料",
  };
  res.json(resp);
};

export const getUserById = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) {
    const resp: MyResponse<null> = {
      data: null,
      message: "請提供有效的用戶 ID",
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
      message: "找不到該用戶",
    };
    res.status(404).json(resp);
    return;
  }
  console.log(data);
  const resp: MyResponse<SupabaseAllowFieldsUser> = {
    data: data,
    message: "成功取得用戶資料",
  };
  res.json(resp);
};

export const getUserCoinsById = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) {
    const resp: MyResponse<null> = {
      data: null,
      message: "請提供有效的用戶 ID",
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
      message: "找不到用戶餘額",
    };
    res.status(404).json(resp);
    return;
  }
  const resp: MyResponse<SupabaseUserCoins> = {
    data: data,
    message: "成功取得用戶餘額",
  };
  res.json(resp);
};

export const getUserStatsById = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) {
    const resp: MyResponse<null> = {
      data: null,
      message: "請提供有效的用戶 ID",
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
      message: "找不到用戶統計資料",
    };
    res.status(404).json(resp);
    return;
  }
  const resp: MyResponse<SupabaseStatsView> = {
    data: data,
    message: "成功取得用戶統計資料",
  };
  res.json(resp);
};

export const getUserSpinsById = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) {
    const resp: MyResponse<null> = {
      data: null,
      message: "請提供有效的用戶 ID",
    };
    res.status(400).json(resp);
    return;
  }

  const { count } = req.query as {
    count?: string;
  };

  let limit: number | undefined;

  if (count !== undefined) {
    const n = Number(count);
    // 檢查 count 是否為正整數
    if (!Number.isInteger(n) || n <= 0) {
      const resp: MyResponse<null> = {
        data: null,
        message: "count 參數無效，請提供正整數",
      };
      res.status(400).json(resp);
      return;
    }
    limit = n;
  }

  let query = supabase
    .from("spins")
    .select<"*", SupabaseSpin>("*")
    .eq("user_id", id)
    .order("created_at", { ascending: false }); // 預設依照 created_at 降序排列

  if (limit !== undefined) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error) {
    const resp: MyResponse<SupabaseSpin[]> = {
      data: null,
      message: error.message || "無法取得用戶遊戲紀錄",
    };
    res.status(500).json(resp);
    return;
  }

  const resp: MyResponse<SupabaseSpin[]> = {
    data: data,
    message: "成功取得用戶遊戲紀錄",
  };
  res.json(resp);
};
