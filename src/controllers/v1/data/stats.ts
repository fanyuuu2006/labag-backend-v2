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

export const getStatsById = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) {
    const resp: MyResponse<SupabaseUserStatsViewItem> = {
      data: null,
      message: "用戶 ID 未提供",
    };
    res.status(400).json(resp);
    return;
  }
  const { data, error } = await supabase
    .from("user_stats_view")
    .select<"*", SupabaseUserStatsViewItem>("*")
    .eq("user_id", id)
    .single();
  if (error) {
    const resp: MyResponse<SupabaseUserStatsViewItem> = {
      data: null,
      message: "用戶統計資料不存在",
    };
    res.status(404).json(resp);
    return;
  }
  const resp: MyResponse<SupabaseUserStatsViewItem> = {
    data: data,
    message: "用戶統計資料取得成功",
  };
  res.json(resp);
};
