import { Request, Response } from "express";
import { SupabaseUser } from "../../../types/user";
import { MyResponse } from "../../../types";

export const getUsersProfile = (req: Request, res: Response) => {
  const user = req.user as SupabaseUser;
  const resp: MyResponse<SupabaseUser> = {
    data: user,
    message: "用戶資料取得成功",
  };
  res.json(resp);
};
