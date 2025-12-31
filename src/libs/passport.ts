import { SignOptions } from "../types/user";

export const scopes: Record<SignOptions, string[]> = {
  google: ["profile", "email"],
};
