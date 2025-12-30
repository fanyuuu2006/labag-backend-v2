import { SignOptions } from "../types";

export const scopes: Record<SignOptions, string[]> = {
  google: ["profile", "email"],
};
