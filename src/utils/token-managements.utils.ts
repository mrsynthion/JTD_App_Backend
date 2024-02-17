import { decode, JwtPayload, sign, SignOptions, verify } from "jsonwebtoken";
import { ErrorCode } from "../types/error.types";
import * as dotenv from "dotenv";
import { User } from "../api/entity/User";
import { UserBasicDto } from "../dto/user.dto";
import { Request } from "express";

dotenv.config();
export const PRIVATE_KEY = "PRIVATE_KEY";
export const TokenName = "token";

export interface TokenPayload extends JwtPayload {
  user: UserBasicDto;
}

const options: SignOptions = {
  mutatePayload: false,
  expiresIn: "1m",
};

export function generateToken(user: User | UserBasicDto): string {
  try {
    const privateKey: string = process.env[PRIVATE_KEY]!;
    if (!privateKey) {
      throw new Error(ErrorCode.TOKEN_NPK);
    }
    return sign({ user } as TokenPayload, privateKey, options);
  } catch ({ message }) {
    throw new Error(ErrorCode.TOKEN_UTGT);
  }
}

export function verifyToken(token: string): boolean {
  try {
    return !!verify(token, process.env[PRIVATE_KEY]!);
  } catch ({ message }) {
    if ((message as string).includes("expired")) {
      throw new Error(ErrorCode.TOKEN_TE);
    }
    throw new Error(ErrorCode.TOKEN_WT);
  }
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
