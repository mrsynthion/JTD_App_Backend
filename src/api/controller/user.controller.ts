import { NextFunction, Request, Response } from "express";
import { AppDataSource } from "../../data-source";
import { User } from "../entity/User";
import { ErrorCode } from "../../types/error.types";
import { Repository } from "typeorm";
import { validateEmail, validateNewPassword } from "../../utils/auth.utils";
import { hash } from "bcrypt";
import { saltRounds } from "../../types/auth.types";
import { EditUserDto, UserDto } from "../../dto/user.dto";
import {
  getDataFromTokenByKey,
  getTokenFromRequest,
} from "../../utils/token-managements.utils";
import { mapUserToUserDto } from "../../utils/user.utils";
import { HttpCode, successMessage } from "../../types/http.types";
import { SuccessMessageDto } from "../../dto/http.dto";

export class UserController {
  static async getCurrentUserData(
    req: Request,
    res: Response<UserDto>,
    next: NextFunction,
  ): Promise<void> {
    try {
      const token = getTokenFromRequest(req);
      const { id } = getDataFromTokenByKey(token, "user");
      const userRepository: Repository<User> =
        AppDataSource.getRepository(User);
      const user: User = (await userRepository
        .createQueryBuilder("user")
        .select([
          "user.id",
          "user.firstName",
          "user.lastName",
          "user.email",
          "project.name",
          "project.key",
          "project.type",
          "project.projectManagementType",
        ])
        .leftJoinAndSelect("user.userInProjects", "userInProject")
        .leftJoin("userInProject.project", "project")
        .where({
          id,
        })
        .getOne()) as User;
      if (!user) throw Error(ErrorCode.USER_CNFU);

      const userDto = mapUserToUserDto(user);
      res.status(HttpCode.SUCCESS).json(userDto);
    } catch ({ message }) {
      next(message);
    }
  }

  static async editCurrentUser(
    req: Request<unknown, EditUserDto>,
    res: Response<SuccessMessageDto>,
    next: NextFunction,
  ): Promise<void> {
    try {
      let user: EditUserDto = req.body;
      const token = getTokenFromRequest(req);
      const { id } = getDataFromTokenByKey(token, "user");
      const userRepository: Repository<User> =
        AppDataSource.getRepository(User);
      const isUserExist: boolean = await userRepository.exist({
        where: { id },
      });
      if (!id) throw new Error(ErrorCode.USER_NVII);
      if (!isUserExist) throw new Error(ErrorCode.USER_CNFU);
      if (user.email) validateEmail(user.email);
      if (user.password) {
        validateNewPassword(user.password);
        const hashedPass: string = await hash(user.password, saltRounds);
        user = { ...user, password: hashedPass };
      }
      user = { ...user, id };
      await userRepository.save(user);
      res.status(HttpCode.SUCCESS).json(successMessage);
    } catch ({ message }) {
      if ((message as string).includes("uq1")) message = ErrorCode.AUTH_TEIAIU;
      next(message);
    }
  }
}
