import { AppDataSource } from "../../data-source";
import { User } from "../entity/User";
import { sendError } from "../../utils/error.utils";
import {
  Filters,
  Page,
  SortBy,
  SortDirection,
} from "../../global-types/pagination.types";
import { Response } from "express";
import { hash } from "bcrypt";
import { ErrorCode } from "../../global-types/error.types";
import { saltRounds } from "../../global-types/auth.types";
import { validateEmail, validateNewPassword } from "../../utils/auth.utils";

const userRepository = AppDataSource.getRepository(User);

async function getUserPage(
  { page, size, sort, id, email, firstName, lastName }: Filters<User>,
  res: Response<Page<User>>,
): Promise<void> {
  try {
    const data = await AppDataSource.transaction(async (appDataSource) => {
      const totalElements = await appDataSource
        .getRepository(User)
        .createQueryBuilder("user")
        .where("user.id like :id", { id: `%${id || ""}%` })
        .andWhere("user.email like :email", { email: `%${email || ""}%` })
        .andWhere("user.firstName like :firstName", {
          firstName: `%${firstName || ""}%`,
        })
        .andWhere("user.lastName like :lastName", {
          lastName: `%${lastName || ""}%`,
        })
        .getCount();

      const skip: number = size * (page - 1) || 0;
      size = size === undefined || size === null ? totalElements : size;
      const sortBy: SortBy<User> = sort?.[0] ? sort[0] : "id";
      const sortDirection: SortDirection = sort?.[1] ? sort[1] : "ASC";

      const content = await appDataSource
        .getRepository(User)
        .createQueryBuilder("user")
        .select(["user.id", "user.firstName", "user.lastName", "user.email"])
        .skip(skip)
        .take(size)
        .where("user.id like :id", { id: `%${id || ""}%` })
        .andWhere("user.email like :email", { email: `%${email || ""}%` })
        .andWhere("user.firstName like :firstName", {
          firstName: `%${firstName || ""}%`,
        })
        .andWhere("user.lastName like :lastName", {
          lastName: `%${lastName || ""}%`,
        })
        .addOrderBy(sortBy, sortDirection)
        .getMany();

      return {
        content,
        totalElements,
        totalPages: Math.floor(totalElements / size || 0),
        numberOfElements: content.length,
      } as Page<User>;
    });
    res.statusCode = 200;
    res.json(data);
  } catch ({ message }) {
    sendError(400, message, res);
  }
}

async function getCertainUser(id: string, res: Response): Promise<void> {
  try {
    const user: User = await userRepository.findOne({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
      },
      where: {
        id,
      },
    });
    res.statusCode = 200;
    res.json(user);
  } catch ({ message }) {
    sendError(400, message, res);
  }
}

async function editCertainUser(
  id: string,
  user: User,
  res: Response<User>,
): Promise<void> {
  try {
    delete user["id"];
    const userFromBase: User | undefined = await userRepository.findOneBy({
      id,
    });
    if (!id || !userFromBase) throw new Error(ErrorCode.NVII);
    if (user.email) validateEmail(user.email);
    if (user.password) {
      validateNewPassword(user.password);
      const hashedPass: string = await hash(user.password, saltRounds);
      user = { ...user, password: hashedPass };
    }
    user = { ...user, id };
    await userRepository.save(user);
    const newUser: User = await userRepository.findOneBy({ id });
    delete newUser["password"];
    res.statusCode = 200;
    res.json(newUser);
  } catch ({ message }) {
    let newMessage: ErrorCode = message;
    if (message.includes("uq1")) newMessage = ErrorCode.TEIAIU;

    sendError(400, newMessage, res);
  }
}

export const UserControllerFunctions = {
  getUserPage,
  getCertainUser,
  editCertainUser,
};
