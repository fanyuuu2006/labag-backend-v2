import { Request, Response } from "express";
import { supabase } from "../../../configs/supabase";
import { MyResponse } from "../../../types";
import { SupabaseRecord } from "../../../types/records";

export const getRecords = async (_: Request, res: Response) => {
  const { data, error } = await supabase.from("records").select("*");
  const resp: MyResponse<SupabaseRecord[]> = {
    data: data as SupabaseRecord[],
    message: error ? error.message : '紀錄取得成功',
  };
  if (error) {
    res.status(500).json(resp);
    return;
  }
  res.json(resp);
};
