import { Request, Response } from "express";
import { supabase } from "../../../configs/supabase";
import { MyResponse } from "../../../types";
import { SupabaseUserStatsViewItem } from "../../../types/user_stats_view";

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
  const { ascending } = req.query;

  // 定義允許排序的欄位白名單
  const validKeys: (keyof SupabaseUserStatsViewItem)[] = [
    "play_count",
    "highest_score",
  ];

  // 驗證 key 是否合法
  if (!validKeys.includes(key as keyof SupabaseUserStatsViewItem)) {
    const resp: MyResponse<null> = {
      data: null,
      message: `無效的排序鍵值: ${key}。允許的值為: ${validKeys.join(", ")}`,
    };
    res.status(400).json(resp);
    return;
  }

  const { data, error } = await supabase
    .from("user_stats_view")
    .select<"*", SupabaseUserStatsViewItem>("*")
    .order(key as keyof SupabaseUserStatsViewItem, {
      ascending: ascending === "true",
    });
  if (error) {
    const resp: MyResponse<SupabaseUserStatsViewItem[]> = {
      data: null,
      message: `依 ${key} 取得用戶統計資料時發生錯誤`,
    };
    res.status(500).json(resp);
    return;
  }
  const resp: MyResponse<SupabaseUserStatsViewItem[]> = {
    data: data,
    message: `依 ${key} 取得用戶統計資料成功`,
  };
  res.json(resp);
};
