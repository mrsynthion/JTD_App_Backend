import { ErrorCode } from "../types/error.types";
import { RegisterDto } from "../dto/auth.dto";
import { compare } from "bcrypt";

function validatePassword(password: string): void {
  if (!password) throw new Error(ErrorCode.SUPIR);
}

function validateNewPassword(password: string): void {
  validatePassword(password);
  const isMinTenChars: boolean = password.length >= 10;
  const isMinOneBigChars: boolean = /[A-Z]/.test(password);
  const isMinOneSmallChars: boolean = /[a-z]/.test(password);
  const isMinOneNumber: boolean = /[0-9]/.test(password);
  const isMinOneSymbol: boolean = /[^A-Za-z0-9]/.test(password);

  const isPasswordCorrect: boolean =
    isMinTenChars &&
    isMinOneBigChars &&
    isMinOneSmallChars &&
    isMinOneNumber &&
    isMinOneSymbol;

  if (!isPasswordCorrect) throw new Error(ErrorCode.SUPSHMTCALOSCOBCONOSC);
}

function validateEmail(email: string): void {
  if (!email) throw new Error(ErrorCode.SUEIR);
}

function validateFirstName(firstName: string): void {
  if (!firstName) throw new Error(ErrorCode.SUFNIR);
}

function validateLastName(lastName: string): void {
  if (!lastName) throw new Error(ErrorCode.SULNIR);
}

function validateSignUpData({
  password,
  email,
  firstName,
  lastName,
}: RegisterDto): void {
  validateEmail(email);
  validateNewPassword(password);
  validateFirstName(firstName);
  validateLastName(lastName);
}

async function comparePasswords(
  password: string,
  databasePassword: string,
): Promise<void> {
  const result = await compare(password, databasePassword);
  if (result !== true) throw new Error(ErrorCode.APDNM);
}

export {
  validateSignUpData,
  validateEmail,
  validateNewPassword,
  validatePassword,
  comparePasswords,
};
