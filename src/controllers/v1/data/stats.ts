import { Request, Response } from "express";
import { supabase } from "../../../configs/supabase";
import { MyResponse } from "../../../types";
import { SupabaseUserStatsViewItem } from "../../../types/user_stats_view";
import { VALID_KEYS } from "../../../libs";

export const getStats = async (req: Request, res: Response) => {
  const { data, error } = await supabase
    .from("user_stats_view")
    .select<"*", SupabaseUserStatsViewItem>("*");
  if (error) {
    const resp: MyResponse<SupabaseUserStatsViewItem[]> = {
      data: null,
      message: "取得用戶統計資料時發生錯誤",
    };
    res.status(500).json(resp);
    return;
  }
  const resp: MyResponse<SupabaseUserStatsViewItem[]> = {
    data: data,
    message: "用戶統計資料取得成功",
  };
  res.json(resp);
};

// 依鍵值 (keyof SupabaseUserStatsViewItem) 取得被排序用戶統計資料
export const getStatsByKey = async (req: Request, res: Response) => {
  const { key } = req.params;
  const { ascending, count } = req.query;

  let limit: number | undefined;

  if (count !== undefined) {
    const n = Number(count);

    // 檢查 count 是否為正整數
    if (!Number.isInteger(n) || n <= 0) {
      const resp: MyResponse<null> = {
        data: null,
        message: "count 參數格式錯誤，應為正整數",
      };
      res.status(400).json(resp);
      return;
    }

    limit = n;
  }

  // 驗證 key 是否合法
  if (!VALID_KEYS.includes(key as (typeof VALID_KEYS)[number])) {
    const resp: MyResponse<null> = {
      data: null,
      message: `無效的排序鍵值: ${key}。允許的值為: ${VALID_KEYS.join(", ")}`,
    };
    res.status(400).json(resp);
    return;
  }

  let query = supabase
    .from("user_stats_view")
    .select<"*", SupabaseUserStatsViewItem>("*")
    .order(key as keyof SupabaseUserStatsViewItem, {
      ascending: ascending === "true",
    });

  // 有 count 才加 limit
  if (limit !== undefined) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error) {
    const resp: MyResponse<SupabaseUserStatsViewItem[]> = {
      data: null,
      message: error.message || "取得用戶統計資料時發生錯誤",
    };
    res.status(500).json(resp);
    return;
  }
  const resp: MyResponse<SupabaseUserStatsViewItem[]> = {
    data: data,
    message:
      limit !== undefined
        ? `依 ${key} 排序的前 ${limit} 筆用戶統計資料取得成功`
        : `依 ${key} 排序的所有用戶統計資料取得成功`,
  };
  res.json(resp);
};
