import {
  comparePasswords,
  validateEmail,
  validatePassword,
  validateSignUpData,
} from "../../utils/auth.utils";
import { hash } from "bcrypt";
import { LoginDto, RegisterDto } from "../../dto/auth.dto";
import { NextFunction, Request, Response } from "express";
import { logoutMessage, saltRounds } from "../../types/auth.types";
import { Repository } from "typeorm";
import { User } from "../entity/User";
import { AppDataSource } from "../../data-source";
import { ErrorCode } from "../../types/error.types";
import {
  generateToken,
  getTokenFromRequest,
  TokenName,
  verifyToken,
} from "../../utils/token-managements.utils";
import { UserBasicDto } from "../../dto/user.dto";
import { HttpCode } from "../../types/http.types";

export class AuthController {
  static async signup(
    req: Request<RegisterDto>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      let registerUserData: RegisterDto = req.body;
      validateSignUpData(registerUserData);
      const hashedPass: string = await hash(
        registerUserData.password,
        saltRounds,
      );
      registerUserData = { ...registerUserData, password: hashedPass };
      const userRepository: Repository<User> =
        AppDataSource.getRepository(User);
      const newUser: UserBasicDto = (await userRepository.save(
        registerUserData,
      )) as UserBasicDto;
      delete (newUser as { password?: string })["password"];
      res.status(HttpCode.CREATED).json(newUser);
    } catch ({ message }) {
      let newMessage: ErrorCode = message as ErrorCode;
      if (newMessage.toLowerCase().includes("duplicate"))
        newMessage = ErrorCode.AUTH_TEIAIU;
      next(newMessage);
    }
  }

  static async login(
    req: Request<LoginDto>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { email, password } = req.body;
      validateEmail(email);
      validatePassword(password);
      const userRepository: Repository<User> =
        AppDataSource.getRepository(User);
      const user: User = (await userRepository.findOne({
        where: {
          email,
        },
      })) as User;
      if (!user) throw new Error(ErrorCode.AUTH_CNFU);
      await comparePasswords(password, user.password!);

      delete user["password"];
      const token = generateToken(user);
      res
        .status(HttpCode.SUCCESS)
        .cookie(TokenName, token, { httpOnly: true })
        .json(user);
    } catch ({ message }) {
      let newMessage: ErrorCode = message as ErrorCode;
      if (newMessage.includes("uq1")) newMessage = ErrorCode.AUTH_TEIAIU;
      next(newMessage);
    }
  }

  static async logout(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      res
        .clearCookie(TokenName)
        .status(HttpCode.SUCCESS)
        .json({ message: logoutMessage });
    } catch ({ message }) {
      next(message);
    }
  }

  static verifyUserToken(
    req: Request,
    res: Response,
    next: NextFunction,
  ): void {
    try {
      const token: string = getTokenFromRequest(req);
      const isValidToken: boolean = !!token && verifyToken(token);
      res.status(HttpCode.SUCCESS).json({ isValidToken });
    } catch ({ message }) {
      next(message);
    }
  }
}
