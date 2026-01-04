import { Request, Response } from "express";
import { supabase } from "../../../configs/supabase";
import { MyResponse } from "../../../types";
import { SupabaseRankingViewItem } from "../../../types/ranking_view";

export const getRanking = async (req: Request, res: Response) => {
  const { count } = req.query;
  let limit: number | undefined = undefined;
  if (count !== undefined) {
    const n = Number(count);
    if (!Number.isInteger(n) || n <= 0) {
      const resp: MyResponse<SupabaseRankingViewItem[]> = {
        data: null,
        message: "count 參數格式錯誤，應為正整數",
      };
      res.status(400).json(resp);
      return;
    }
    limit = n;
  }
  let query = supabase
    .from("ranking_view")
    .select<"*", SupabaseRankingViewItem>("*")
    .order("score", { ascending: false });

  if (limit !== undefined) {
    query = query.limit(limit);
  }
  const { data, error } = await query;
  if (error) {
    const resp: MyResponse<SupabaseRankingViewItem[]> = {
      data: null,
      message: error.message || "取得排名時發生錯誤",
    };
    res.status(500).json(resp);
    return;
  }
  const resp: MyResponse<SupabaseRankingViewItem[]> = {
    data: data,
    message:
      limit !== undefined ? `前 ${limit} 名排名取得成功` : "所有排名取得成功",
  };
  res.json(resp);
};
