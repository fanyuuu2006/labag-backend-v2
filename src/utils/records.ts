import { createHash } from "crypto";
import { GameRecord } from "labag";
import { SupabaseUser } from "../types/user";

export const myHash = (id: SupabaseUser["id"], records: GameRecord): string => {
  // 使用 SHA-256 演算法，兼顧安全性與效能
  const hash = createHash("sha256");

  // 加入 ID 作為雜湊的一部分，確保不同使用者的相同紀錄會有不同的 Hash (類似 Salt)
  hash.update(id.toString());

  // 將紀錄內容序列化
  // 注意：JSON.stringify 在 key 順序不同時會產生不同字串，若需嚴格一致性可考慮 fast-json-stable-stringify
  // 但以效能優先考量，原生 JSON.stringify 是最佳選擇
  hash.update(JSON.stringify(records));

  return hash.digest("hex");
};
