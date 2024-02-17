import { NextFunction, Request, Response } from "express";
import { getTokenFromRequest } from "../utils/token-managements.utils";

export const LoggerMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.log(req.cookies);
  console.log({
    url: req.baseUrl + req.url,
    params: req.params,
    query: req.query,
    body: req.body,
    cookies: getTokenFromRequest(req),
    status: res.statusCode,
  });
  next();
};
