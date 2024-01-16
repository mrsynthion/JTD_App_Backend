export const TokenName = "token";

export const saltRounds: number = 10;
export const logoutMessage: string = "Succesfully logout";

export interface RegisterDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface LoginDto {
  email: string;
  password: string;
}
