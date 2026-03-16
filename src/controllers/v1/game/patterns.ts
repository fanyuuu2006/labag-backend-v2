import { Request, Response } from "express";
import { supabase } from "../../../configs/supabase";
import { Pattern, Payout } from "labag";
import { MyResponse } from "../../../types";
import { PatternWithPayouts } from "../../../types/patterns";

export const getPatterns = async (_: Request, res: Response) => {
  const { data: patternsData, error: patternsError } = await supabase
    .from("patterns")
    .select<"*", Pattern>("*");

  if (patternsError || !patternsData) {
    const resp: MyResponse<null> = {
      data: null,
      message: patternsError?.message || "取得圖案列表時發生錯誤",
    };
    res.status(500).json(resp);
    return;
  }

  const { data: payoutsData, error: payoutsError } = await supabase
    .from("payouts")
    .select<"*", Payout>("*");

  if (payoutsError || !payoutsData) {
    const resp: MyResponse<null> = {
      data: null,
      message: payoutsError?.message || "取得賠率列表時發生錯誤",
    };
    res.status(500).json(resp);
    return;
  }

  const patternsWithPayouts: PatternWithPayouts[] = patternsData.map(
    (pattern) => {
      const patternPayouts = payoutsData.filter(
        (payout) => payout.pattern_id === pattern.id,
      );
      return {
        ...pattern,
        payouts: patternPayouts,
      };
    },
  );

  const resp: MyResponse<PatternWithPayouts[]> = {
    data: patternsWithPayouts,
    message: "圖案列表取得成功",
  };
  res.json(resp);
};

export const getPatternById = async (req: Request, res: Response) => {
  const { id } = req.params;

  // 先取得 pattern 資訊
  const { data: patternData, error: patternError } = await supabase
    .from("patterns")
    .select<"*", Pattern>("*")
    .eq("id", id)
    .single();

  if (patternError) {
    const resp: MyResponse<null> = {
      data: null,
      message: patternError.message || "取得圖案時發生錯誤",
    };
    res.status(500).json(resp);
    return;
  }

  // 再取得該 pattern 的 payouts
  const { data: payoutsData, error: payoutsError } = await supabase
    .from("payouts")
    .select<"*", Payout>("*")
    .eq("pattern_id", id);

  if (payoutsError) {
    const resp: MyResponse<null> = {
      data: null,
      message: payoutsError.message || "取得賠率時發生錯誤",
    };
    res.status(500).json(resp);
    return;
  }

  const patternWithPayouts: PatternWithPayouts = {
    ...patternData,
    payouts: payoutsData || [],
  };

  const resp: MyResponse<PatternWithPayouts> = {
    data: patternWithPayouts,
    message: "圖案取得成功",
  };
  res.json(resp);
};
