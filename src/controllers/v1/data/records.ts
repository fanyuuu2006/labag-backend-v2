import { Request, Response } from "express";
import { supabase } from "../../../configs/supabase";
import { MyResponse } from "../../../types";
import { FrontendRecord, SupabaseRecord } from "../../../types/records";
import { SupabaseUser } from "../../../types/user";
import { RecordChecker } from "../../../libs/recordChecker";

export const getRecords = async (req: Request, res: Response) => {
  const rawCount = req.query.count;

  let limit: number | undefined;

  if (rawCount !== undefined) {
    const n = Number(rawCount);

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
    const resp: MyResponse<null> = {
      data: null,
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

export const getRecordsByUserId = async (req: Request, res: Response) => {
  const { user_id } = req.params;

  if (!user_id) {
    const resp: MyResponse<null> = {
      data: null,
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
      const resp: MyResponse<null> = {
        data: null,
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
    .eq("user_id", user_id)
    .order("created_at", { ascending: false });

  if (limit !== undefined) {
    query = query.limit(limit);
  }
  const { data, error } = await query;
  if (error) {
    const resp: MyResponse<null> = {
      data: null,
      message: error.message || "取得用戶紀錄時發生錯誤",
    };
    res.status(500).json(resp);
    return;
  }
  const resp: MyResponse<SupabaseRecord[]> = {
    data: data as SupabaseRecord[],
    message:
      limit !== undefined
        ? `用戶 ${user_id} 最近 ${limit} 筆紀錄取得成功`
        : `用戶 ${user_id} 所有紀錄取得成功`,
  };
  res.json(resp);
};

export const postRecords = async (req: Request, res: Response) => {
  const rawRecord = req.body as FrontendRecord;
  const checker = new RecordChecker(rawRecord.times);
  if (!checker.validate(rawRecord)) {
    const resp: MyResponse<null> = {
      data: null,
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
      const resp: MyResponse<null> = {
        data: null,
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
    const resp: MyResponse<null> = {
      data: null,
      message: `伺服器錯誤: ${
        error instanceof Error ? error.message : String(error)
      }`,
    };
    res.status(500).json(resp);
    return;
  }
};
