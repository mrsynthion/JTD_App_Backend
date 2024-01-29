import { decode, JwtPayload, sign, SignOptions, verify } from "jsonwebtoken";
import { ErrorCode } from "../types/error.types";
import * as dotenv from "dotenv";
import { User } from "../api/entity/User";
import { UserDto } from "../dto/user.dto";

dotenv.config();
export const PRIVATE_KEY = "PRIVATE_KEY";

export interface TokenPayload extends JwtPayload {
  user: UserDto;
}

const options: SignOptions = {
  mutatePayload: false,
  expiresIn: "30m",
};

function generateToken(user: User | UserDto): string {
  const privateKey: string = process.env[PRIVATE_KEY]!;
  if (!privateKey) {
    throw new Error(ErrorCode.TNPK);
  }
  return sign({ user } as TokenPayload, privateKey, options);
}

function verifyToken(token: string): boolean {
  return !!verify(token, process.env[PRIVATE_KEY]!);
}

function getDataFromToken(token: string): TokenPayload {
  return decode(token) as TokenPayload;
}

function getDataFromTokenByKey(
  token: string,
  key: keyof TokenPayload,
): TokenPayload[keyof TokenPayload] {
  return getDataFromToken(token)[key];
}

export { generateToken, verifyToken, getDataFromToken, getDataFromTokenByKey };
