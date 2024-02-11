import { NextFunction, Request, Response } from "express";
import * as dotenv from "dotenv";
import {
  getTokenFromRequest,
  verifyToken,
} from "../utils/token-managements.utils";
import { HttpCode } from "../types/http.types";
import { ErrorCode, ServerError } from "../types/error.types";

dotenv.config();

export const AuthenticationMiddleware = (
  req: Request,
  res: Response<ServerError>,
  next: NextFunction,
) => {
  try {
    const token = getTokenFromRequest(req);
    if (!token) {
      return res
        .status(HttpCode.UNAUTHORIZED)
        .json({ message: ErrorCode.SERVER_UNA });
    }

    verifyToken(token);
    next();
  } catch (error) {
    return res
      .status(HttpCode.UNAUTHORIZED)
      .json({ message: ErrorCode.SERVER_UNA });
  }
};
