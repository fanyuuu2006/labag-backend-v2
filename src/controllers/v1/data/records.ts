import { Request, Response } from "express";
import { supabase } from "../../../configs/supabase";
import { MyResponse } from "../../../types";
import { SupabaseRecord } from "../../../types/records";
import { SupabaseUser } from "../../../types/user";
import { checker, GameRecord } from "labag";
import { myHash } from "../../../utils/records";

export const getRecords = async (req: Request, res: Response) => {
  const { count } = req.query;

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

  let query = supabase
    .from("records")
    .select<"*", SupabaseRecord>("*")
    .order("created_at", { ascending: false });

  // 有 count 才加 limit
  if (limit !== undefined) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error) {
    const resp: MyResponse<SupabaseRecord[]> = {
      data: null,
      message: error.message || "取得紀錄時發生錯誤",
    };
    res.status(500).json(resp);
    return;
  }

  const resp: MyResponse<SupabaseRecord[]> = {
    data: data,
    message:
      limit !== undefined ? `最近 ${limit} 筆紀錄取得成功` : "所有紀錄取得成功",
  };

  res.json(resp);
};

export const postRecords = async (req: Request, res: Response) => {
  const rawRecord = req.body as GameRecord;
  if (!checker.check(rawRecord)) {
    const resp: MyResponse<SupabaseRecord> = {
      data: null,
      message: "分數格式錯誤",
    };
    res.status(400).json(resp);
    return;
  }
  const user = req.user as SupabaseUser;
  const user_id = user.id;
  const hs = myHash(user_id, rawRecord);
  const record: Omit<SupabaseRecord, "id" | "created_at"> = {
    score: rawRecord.score,
    user_id,
    hash: hs,
  };
  const { data, error } = await supabase
    .from("records")
    .insert([record])
    .select<"*", SupabaseRecord>("*")
    .single();
  if (error) {
    // 判斷是否為唯一鍵衝突 (PostgreSQL error code 23505)
    if (error.code === "23505") {
      const resp: MyResponse<null> = {
        data: null,
        message: "此紀錄已存在",
      };
      res.status(409).json(resp);
      return;
    }

    const resp: MyResponse<SupabaseRecord> = {
      data: null,
      message: error.message || "新增紀錄時發生錯誤",
    };
    res.status(500).json(resp);
    return;
  }

  const resp: MyResponse<SupabaseRecord> = {
    data: data,
    message: "紀錄新增成功",
  };
  res.status(201).json(resp);
};
