import { decode, JwtPayload, sign, SignOptions, verify } from "jsonwebtoken";
import { ErrorCode } from "../types/error.types";
import * as dotenv from "dotenv";
import { User } from "../api/entity/User";
import { UserMinimumDto } from "../dto/user.dto";
import { Request } from "express";

dotenv.config();
export const PRIVATE_KEY = "PRIVATE_KEY";
export const TokenName = "token";

export interface TokenPayload extends JwtPayload {
  user: UserMinimumDto;
}

const options: SignOptions = {
  mutatePayload: false,
  expiresIn: "30m",
};

export function generateToken(user: User | UserMinimumDto): string {
  const privateKey: string = process.env[PRIVATE_KEY]!;
  if (!privateKey) {
    throw new Error(ErrorCode.TNPK);
  }
  return sign({ user } as TokenPayload, privateKey, options);
}

export function verifyToken(token: string): boolean {
  return !!verify(token, process.env[PRIVATE_KEY]!);
}

export function getDataFromToken(token: string): TokenPayload {
  return decode(token) as TokenPayload;
}

export function getDataFromTokenByKey(
  token: string,
  key: keyof TokenPayload,
): TokenPayload[keyof TokenPayload] {
  return getDataFromToken(token)[key];
}

export function getTokenFromRequest(req: Request<any>): string {
  return req.cookies[TokenName];
}
