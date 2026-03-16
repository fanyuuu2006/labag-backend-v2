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
      message: patternsError?.message || "無法載入遊戲圖案列表",
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
      message: payoutsError?.message || "無法載入遊戲賠率列表",
    };
    res.status(500).json(resp);
    return;
  }

  const totalWeight = patternsData.reduce((sum, p) => sum + p.weight, 0);
  const patternsWithPayouts: PatternWithPayouts[] = patternsData.map(
    (pattern) => {
      const patternPayouts = payoutsData.filter(
        (payout) => payout.pattern_id === pattern.id,
      );
      const probability = totalWeight > 0 ? pattern.weight / totalWeight : 0;
      return {
        ...pattern,
        probability,
        payouts: patternPayouts,
      };
    },
  );

  const resp: MyResponse<PatternWithPayouts[]> = {
    data: patternsWithPayouts,
    message: "成功取得圖案列表",
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

  if (patternError || !patternData) {
    const resp: MyResponse<null> = {
      data: null,
      message: patternError?.message || "取得圖案時發生錯誤",
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

  // 取得所有圖案以計算總權重，進而算出機率
  const { data: allPatternsData, error: allPatternsError } = await supabase
    .from("patterns")
    .select<"weight", { weight: number }>("weight");

  if (allPatternsError || !allPatternsData) {
    const resp: MyResponse<null> = {
      data: null,
      message: allPatternsError?.message || "計算機率時發生錯誤",
    };
    res.status(500).json(resp);
    return;
  }

  const totalWeight = allPatternsData.reduce((sum, p) => sum + p.weight, 0);
  const probability = totalWeight > 0 ? patternData.weight / totalWeight : 0;

  const patternWithPayouts: PatternWithPayouts = {
    ...patternData,
    probability,
    payouts: payoutsData || [],
  };

  const resp: MyResponse<PatternWithPayouts> = {
    data: patternWithPayouts,
    message: "圖案取得成功",
  };
  res.json(resp);
};
