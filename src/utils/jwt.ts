import jwt from "jsonwebtoken";
import ms from "ms";
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from "../libs/env";

export const generateAccessToken = (
  data: string | Buffer | object,
  expiresIn: number | ms.StringValue | undefined = "15m"
) => jwt.sign(data, ACCESS_TOKEN_KEY, { expiresIn });

export const generateRefreshToken = (
  data: string | Buffer | object,
  expiresIn: number | ms.StringValue | undefined = "30d"
) => jwt.sign(data, REFRESH_TOKEN_KEY, { expiresIn });

// 為了相容性保留 generateToken，但建議改用 generateAccessToken
export const generateToken = generateAccessToken;

// 驗證 Access Token
export const verifyAccessToken = (token: string): any =>
  jwt.verify(token, ACCESS_TOKEN_KEY);

// 驗證 Refresh Token
export const verifyRefreshToken = (token: string): any =>
  jwt.verify(token, REFRESH_TOKEN_KEY);
