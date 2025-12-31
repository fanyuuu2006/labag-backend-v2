import { Request, Response } from "express";
import { supabase } from "../../../configs/supabase";
import { MyResponse } from "../../../types";
import { SupabaseRecord } from "../../../types/records";
import { SupabaseUser } from "../../../types/user";

export const getRecords = async (_: Request, res: Response) => {
  const { data, error } = await supabase.from("records").select("*");
  const resp: MyResponse<SupabaseRecord[]> = {
    data: data as SupabaseRecord[],
    message: error ? error.message : "紀錄取得成功",
  };
  if (error) {
    res.status(500).json(resp);
    return;
  }
  res.json(resp);
};

export const postRecords = async (req: Request, res: Response) => {
  const { score } = req.body;
  if (!score || isNaN(score)) {
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
    score,
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
