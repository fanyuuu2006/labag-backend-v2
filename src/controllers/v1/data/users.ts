import { Request, Response } from "express";
import { SupabaseUser } from "../../../types/user";
import { MyResponse } from "../../../types";
import { supabase } from "../../../configs/supabase";
import { ALLOW_USER_FIELDS } from "../../../libs";
import { SupabaseRecord } from "../../../types/records";

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
    const resp: MyResponse<{}> = {
      data: {},
      message: "用戶 ID 未提供",
    };
    res.status(400).json(resp);
    return;
  }
  const { data, error } = await supabase
    .from("users")
    .select(ALLOW_USER_FIELDS.join(", "))
    .eq("id", id)
    .single();
  if (error) {
    const resp: MyResponse<{}> = {
      data: {},
      message: "用戶不存在",
    };
    res.status(404).json(resp);
    return;
  }
  console.log(data);
  const resp: MyResponse<typeof data> = {
    data: data,
    message: "用戶資料取得成功",
  };
  res.json(resp);
};


export const getRecordsByUserId = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    const resp: MyResponse<[]> = {
      data: [],
      message: "用戶 ID 未提供",
    };
    res.status(400).json(resp);
    return;
  }
  const count = req.query.count;
  let limit: number | undefined;
  if (count !== undefined) {
    const n = Number(count);
    if (!Number.isInteger(n) || n <= 0) {
      const resp: MyResponse<[]> = {
        data: [],
        message: "count 參數格式錯誤，應為正整數",
      };
      res.status(400).json(resp);
      return;
    }
    limit = n;
  }
  let query = supabase
    .from("records")
    .select("*")
    .eq("user_id", id)
    .order("created_at", { ascending: false });

  if (limit !== undefined) {
    query = query.limit(limit);
  }
  const { data, error } = await query;
  if (error) {
    const resp: MyResponse<[]> = {
      data: [],
      message: error.message || "取得用戶紀錄時發生錯誤",
    };
    res.status(500).json(resp);
    return;
  }
  const resp: MyResponse<SupabaseRecord[]> = {
    data: data as SupabaseRecord[],
    message:
      limit !== undefined
        ? `用戶 ${id} 最近 ${limit} 筆紀錄取得成功`
        : `用戶 ${id} 所有紀錄取得成功`,
  };
  res.json(resp);
};

export const getStatsByUserId = async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id) {
      const resp: MyResponse<{}> = {
        data: {},
        message: "用戶 ID 未提供",
        };
        res.status(400).json(resp);
        return;
    }
    const { data, error } = await supabase
        .from("user_stats_view")
        .select("*")
        .eq("user_id", id)
        .single();
    if (error) {
        const resp: MyResponse<{}> = {
        data: {},
        message: "用戶統計資料不存在",
        };
        res.status(404).json(resp);
        return;
    }
    const resp: MyResponse<typeof data> = {
        data: data,
        message: "用戶統計資料取得成功",
    };
    res.json(resp);
}

