import { Request, Response } from "express";
import { supabase } from "../../../configs/supabase";
import { Pattern, Payout } from "labag";
import { MyResponse } from "../../../types";
import { PatternWithPayouts } from "../../../types/patterns";
import { patterns, payouts } from "../../../libs/patterns";

export const getPatterns = async (_: Request, res: Response) => {
  const totalWeight = patterns.reduce((sum, p) => sum + p.weight, 0);
  const patternsWithPayouts: PatternWithPayouts[] = patterns.map((pattern) => {
    const patternPayouts = payouts.filter(
      (payout) => payout.pattern_id === pattern.id,
    );
    const probability = totalWeight > 0 ? pattern.weight / totalWeight : 0;
    return {
      ...pattern,
      probability,
      payouts: patternPayouts,
    };
  });

  const resp: MyResponse<PatternWithPayouts[]> = {
    data: patternsWithPayouts,
    message: "成功取得圖案列表",
  };
  res.json(resp);
};

export const getPatternById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const pattern = patterns.find((p) => p.id === id);
  if (!pattern) {
    const resp: MyResponse<null> = {
      data: null,
      message: "找不到該圖案",
    };
    res.status(404).json(resp);
    return;
  }
  const patternPayouts = payouts.filter((payout) => payout.pattern_id === id);
  const totalWeight = patterns.reduce((sum, p) => sum + p.weight, 0);
  const probability = totalWeight > 0 ? pattern.weight / totalWeight : 0;
  const patternWithPayouts: PatternWithPayouts = {
    ...pattern,
    probability,
    payouts: patternPayouts,
  };
  const resp: MyResponse<PatternWithPayouts> = {
    data: patternWithPayouts,
    message: "成功取得圖案資料",
  };
  res.json(resp);
};
