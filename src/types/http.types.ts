export enum HttpCode {
  SUCCESS = 200,
  CREATED = 201,
  CLIENT_ERROR = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
}

interface SuccessMessage {
  message: "ok";
}

export const successMessage: SuccessMessage = {
  message: "ok",
};
