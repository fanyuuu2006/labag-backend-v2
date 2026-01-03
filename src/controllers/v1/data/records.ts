import { Request, Response } from "express";
import { supabase } from "../../../configs/supabase";
import { MyResponse } from "../../../types";
import {  SupabaseRecord } from "../../../types/records";
import { SupabaseUser } from "../../../types/user";
import { checker, GameRecord } from "labag";

export const getRecords = async (req: Request, res: Response) => {
  const rawCount = req.query.count;

  let limit: number | undefined;

  if (rawCount !== undefined) {
    const n = Number(rawCount);

    // 檢查 count 是否為正整數
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
    .order("created_at", { ascending: false });

  // 有 count 才加 limit
  if (limit !== undefined) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error) {
    const resp: MyResponse<[]> = {
      data: [],
      message: error.message || "取得紀錄時發生錯誤",
    };
    res.status(500).json(resp);
    return;
  }

  const resp: MyResponse<SupabaseRecord[]> = {
    data: data as SupabaseRecord[],
    message:
      limit !== undefined ? `最近 ${limit} 筆紀錄取得成功` : "所有紀錄取得成功",
  };

  res.json(resp);
};


export const postRecords = async (req: Request, res: Response) => {
  const rawRecord = req.body as GameRecord;
  if (!checker.check(rawRecord)) {
    const resp: MyResponse<{}> = {
      data: {},
      message: "分數格式錯誤",
    };
    res.status(400).json(resp);
    return;
  }
  const user = req.user as SupabaseUser;
  const user_id = user.id;
  const record: Omit<SupabaseRecord, "id" | "created_at"> = {
    score: rawRecord.score,
    user_id,
  };

  try {
    const { data, error } = await supabase
      .from("records")
      .insert([record])
      .select()
      .single();

    if (error) {
      const resp: MyResponse<{}> = {
        data: {},
        message: `Supabase 錯誤：${error.message}`,
      };
      res.status(500).json(resp);
      return;
    }
    const resp: MyResponse<SupabaseRecord> = {
      data: data as SupabaseRecord,
      message: "紀錄新增成功",
    };
    res.status(201).json(resp);
  } catch (error) {
    console.error(error);
    const resp: MyResponse<{}> = {
      data: {},
      message: `伺服器錯誤: ${
        error instanceof Error ? error.message : String(error)
      }`,
    };
    res.status(400).json(resp);
    return;
  }
};
