import { NextFunction, Request, Response } from "express";
import { ErrorCode } from "../types/error.types";

export const unknownErrorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.error(`Error: 500 ${error.message}`);
  return res.status(500).json({ error: "Internal server error" });
};

export const errorHandler = (
  error: Error | ErrorCode,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let errorCode = 400;
  if (error === ErrorCode.TTE) {
    errorCode = 401;
  }
  console.error(`Error: 400 ${error}`);
  return res.status(errorCode).json({ error });
};
