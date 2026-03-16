import { Request, Response } from "express";
import { supabase } from "../../../configs/supabase";
import { MyResponse } from "../../../types";
import { SupabaseStatsView } from "../../../types/stats_view";
import { VALID_STATS_KEYS } from "../../../libs";

export const getStats = async (req: Request, res: Response) => {
  const { data, error } = await supabase
    .from("stats_view")
    .select<"*", SupabaseStatsView>("*");
  if (error) {
    const resp: MyResponse<SupabaseStatsView[]> = {
      data: null,
      message: "無法取得統計資料",
    };
    res.status(500).json(resp);
    return;
  }
  const resp: MyResponse<SupabaseStatsView[]> = {
    data: data,
    message: "成功取得統計資料",
  };
  res.json(resp);
};

// 依鍵值 (keyof SupabaseStatsView) 取得被排序統計資料
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
        message: "count 參數無效，請提供正整數",
      };
      res.status(400).json(resp);
      return;
    }

    limit = n;
  }

  // 驗證 key 是否合法
  if (!VALID_STATS_KEYS.includes(key as (typeof VALID_STATS_KEYS)[number])) {
    const resp: MyResponse<null> = {
      data: null,
      message: `排序鍵值 ${key} 無效。允許的值為: ${VALID_STATS_KEYS.join(", ")}`,
    };
    res.status(400).json(resp);
    return;
  }

  let query = supabase
    .from("stats_view")
    .select<"*", SupabaseStatsView>("*")
    .order(key as keyof SupabaseStatsView, {
      ascending: ascending === "true",
    });

  // 有 count 才加 limit
  if (limit !== undefined) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error) {
    const resp: MyResponse<SupabaseStatsView[]> = {
      data: null,
      message: error.message || "取得統計資料時發生錯誤",
    };
    res.status(500).json(resp);
    return;
  }
  const resp: MyResponse<SupabaseStatsView[]> = {
    data: data,
    message:
      limit !== undefined
        ? `成功取得依 ${key} 排序的前 ${limit} 筆統計資料`
        : `成功取得依 ${key} 排序的所有統計資料`,
  };
  res.json(resp);
};