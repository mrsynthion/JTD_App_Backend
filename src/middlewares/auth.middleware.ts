import { NextFunction, Request, Response } from "express";
import * as dotenv from "dotenv";
import {
  getTokenFromRequest,
  verifyToken,
} from "../utils/token-managements.utils";

dotenv.config();

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = getTokenFromRequest(req);
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    verifyToken(token);
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};
