import { Request, Response } from "express";
import { SupabaseUser } from "../../../types/user";
import { MyResponse } from "../../../types";
import { supabase } from "../../../configs/supabase";
import { ALLOW_USER_FIELDS } from "../../../libs";

export const getUsersProfile = (req: Request, res: Response) => {
  const user = req.user as SupabaseUser;
  const resp: MyResponse<SupabaseUser> = {
    data: user,
    message: "用戶資料取得成功",
  };
  res.json(resp);
};

export const getUserById = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) {
    const resp: MyResponse<null> = {
      data: null,
      message: "用戶 ID 未提供",
    };
    res.status(400).json(resp);
    return;
  }
  const { data, error } = await supabase
    .from("users")
    .select(ALLOW_USER_FIELDS.join(", "))
    .eq("id", id)
    .single();
  if (error || !data) {
    const resp: MyResponse<null> = {
      data: null,
      message: "用戶不存在",
    };
    res.status(404).json(resp);
    return;
  }
  console.log(data);
  const resp: MyResponse = {
    data: data,
    message: "用戶資料取得成功",
  };
  res.json(resp);
};
