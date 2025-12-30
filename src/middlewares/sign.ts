import { Request, Response, NextFunction } from "express";
import passport from "../configs/passport";
import { MyResponse, SignOptions } from "../types";
import { scopes } from "../libs/passport";

export const signInMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const signBy = req.params.signBy as SignOptions;
    const scope = scopes[signBy] || [];
    passport.authenticate(signBy, { scope })(req, res, next);
  } catch (error) {
    console.error(error);
    const resp: MyResponse<null> = {
        data: null,
        message: `伺服器錯誤: ${
          error instanceof Error ? error.message : String(error)
        }`,
    }
    res.status(500).json(resp);
    return;
  }
};

export const signCallBackMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const signBy = req.params.signBy as SignOptions;
    passport.authenticate(signBy, { session: false })(req, res, next);
  } catch (error) {
    console.error(error);
    const resp: MyResponse<null> = {
        data: null,
        message: `伺服器錯誤: ${
          error instanceof Error ? error.message : String(error)
        }`,
    }
    res.status(500).json(resp);
    return;
  }
};