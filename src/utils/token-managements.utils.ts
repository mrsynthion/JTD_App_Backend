import { decode, JwtPayload, sign, SignOptions, verify } from "jsonwebtoken";
import { ErrorCode } from "../global-types/error.types";
import { config } from "dotenv";
import { UserDto } from "../global-types/user.types";

export interface TokenPayload extends JwtPayload {
  user: UserDto;
}

const options: SignOptions = {
  mutatePayload: false,
  expiresIn: "30m",
};

function generateToken(user: UserDto): string {
  const privateKey: string = config().parsed["PRIVATE_KEY"];
  if (!privateKey) {
    throw new Error(ErrorCode.TNPK);
  }
  return sign({ user } as TokenPayload, privateKey, options);
}

function verifyToken(token: string): boolean {
  return !!verify(token, config().parsed["PRIVATE_KEY"]);
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
