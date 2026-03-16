import { Request, Response } from "express";
import { supabase } from "../../../configs/supabase";
import { Pattern, Payout } from "labag";
import { MyResponse } from "../../../types";
export const getPatterns = async (_: Request, res: Response) => {
  const { data, error } = await supabase
    .from("patterns")
    .select<"*", Pattern>("*");

  if (error) {
    const resp: MyResponse<null> = {
      data: null,
      message: error.message || "取得圖案列表時發生錯誤",
    };
    res.status(500).json(resp);
    return;
  }

  const resp: MyResponse<Pattern[]> = {
    data: data,
    message: "圖案列表取得成功",
  };
  res.json(resp);
  return;
};

export const getPatternById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { data, error } = await supabase
    .from("patterns")
    .select<"*", Pattern>("*")
    .eq("id", id)
    .single();

  if (error) {
    const resp: MyResponse<null> = {
      data: null,
      message: error.message || "取得圖案時發生錯誤",
    };
    res.status(500).json(resp);
    return;
  }

  const resp: MyResponse<Pattern> = {
    data: data,
    message: "圖案取得成功",
  };
  res.json(resp);
  return;
};

export const getPatternPayoutsById = async (req: Request, res: Response) => {
    const { id } = req.params;

    const { data, error } = await supabase
        .from("payouts")
        .select<"*", Payout>("*")
        .eq("pattern_id", id);

    if (error) {
        const resp: MyResponse<null> = {
            data: null,
            message: error.message || "取得圖案獎金時發生錯誤",
        };
        res.status(500).json(resp);
        return;
    }

    const resp: MyResponse<Payout[]> = {
        data: data,
        message: "圖案獎金取得成功",
    };
    res.json(resp);
    return;
};
