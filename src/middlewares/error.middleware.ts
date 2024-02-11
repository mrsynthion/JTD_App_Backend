import { NextFunction, Request, Response } from "express";
import { ErrorCode, ServerError } from "../types/error.types";
import { HttpCode } from "../types/http.types";

export const UnknownErrorMiddleware = (
  error: Error,
  req: Request,
  res: Response<ServerError>,
  next: NextFunction,
) => {
  console.error(`Error: HttpCode.INTERNAL_SERVER_ERROR ${error.message}`);
  return res
    .status(HttpCode.INTERNAL_SERVER_ERROR)
    .json({ message: ErrorCode.SERVER_ISE });
};

export const ErrorMiddleware = (
  error: Error | ErrorCode,
  req: Request,
  res: Response<ServerError>,
  next: NextFunction,
) => {
  let errorCode = HttpCode.CLIENT_ERROR;
  if (error === ErrorCode.TOKEN_TE) {
    errorCode = HttpCode.UNAUTHORIZED;
  }
  console.error(`Error: ${errorCode} ${error}`);
  if (error instanceof Error && error.message) {
    return res.status(errorCode).json({ message: error.message as ErrorCode });
  }
  return res.status(errorCode).json({ message: error as ErrorCode });
};
