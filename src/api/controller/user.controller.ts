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

export class UserController {
  static async getCurrentUserData(
    req: Request<{ id: string }>,
    res: Response,
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
          "userInProject.name",
          "userInProject.isLeader",
          "userInProject.type",
          "project.name",
          "project.key",
          "project.type",
          "project.projectManagementType",
        ])
        .leftJoin("user.userInProjects", "userInProject")
        .leftJoin("userInProject.project", "project")
        .where({
          id,
        })
        .getOne()) as User;
      if (!user) throw Error(ErrorCode.UCNFU);
      res.status(200).json(user);
    } catch ({ message }) {
      next(message);
    }
  }

  static async editCertainUser(
    req: Request<{ id: string }, EditUserDto>,
    res: Response,
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
      if (!id) throw new Error(ErrorCode.UNVII);
      if (!isUserExist) throw new Error(ErrorCode.UCNFU);
      if (user.email) validateEmail(user.email);
      if (user.password) {
        validateNewPassword(user.password);
        const hashedPass: string = await hash(user.password, saltRounds);
        user = { ...user, password: hashedPass };
      }
      user = { ...user, id };
      await userRepository.save(user);
      const newUser: UserDto = (await userRepository.findOneBy({
        id,
      })) as UserDto;
      delete (newUser as { password?: string })["password"];
      res.status(200).json({ message: "ok" });
    } catch ({ message }) {
      if ((message as string).includes("uq1")) message = ErrorCode.SUTEIAIU;
      next(message);
    }
  }
}
