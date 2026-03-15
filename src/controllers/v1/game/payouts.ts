import { Request, Response } from "express";
import { supabase } from "../../../configs/supabase";
import { Payout} from "labag";
import { MyResponse } from "../../../types";
export const getPayouts = async (_: Request, res: Response) => {
  const { data, error } = await supabase
    .from("payouts")
    .select<"*", Payout>("*");

  if (error) {
    const resp: MyResponse<null> = {
      data: null,
      message: error.message || "取得賠率列表時發生錯誤",
    };
    res.status(500).json(resp);
    return;
  }

  const resp: MyResponse<Payout[]> = {
    data: data,
    message: "賠率列表取得成功",
  };
  res.json(resp);
  return;
};
