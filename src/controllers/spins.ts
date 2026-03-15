import { Request, Response } from "express";
import { SupabaseUser } from "../types/user";
import { supabase } from "../configs/supabase";
import { LaBaG } from "labag";

export const postSpins = async (req: Request, res: Response) => {
  const user = req.user as SupabaseUser;
    const { bet } = req.body;
    if (typeof bet !== "number" || bet <= 0) {
      res.status(400).json({ message: "Invalid bet amount" });
      return;
    }
};
