import { NextFunction, Request, Response } from "express";
import { Filters, Page, SortDirection } from "../../types/pagination.types";
import { AppDataSource } from "../../data-source";
import { User } from "../entity/User";
import { UserDto, UserInProjectMinimumDto } from "../../dto/user.dto";
import { AddUserInProjectDto } from "../../dto/user-in-project.dto";
import { Repository } from "typeorm";
import { UserInProject } from "../entity/UserInProject";
import { UserInProjectType } from "../../types/user.types";

export class UserInProjectController {
  static async getUserPageByProjectId(
    req: Request<
      { id: string },
      Page<UserInProjectMinimumDto>,
      unknown,
      Filters<UserInProjectMinimumDto>
    >,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const id: string = req.params["id"];
      let {
        id: userId,
        firstName,
        lastName,
        email,
        size,
        page,
        sort,
      } = req.query;
      const data = await AppDataSource.transaction(async (appDataSource) => {
        const query = appDataSource
          .getRepository(User)
          .createQueryBuilder("user")
          .leftJoin("user.userInProjects", "uip")
          .leftJoin("uip.project", "project")
          .select([
            "user.id",
            "user.firstName",
            "user.lastName",
            "user.email",
            "uip.name",
            "uip.isLeader",
            "uip.type",
          ])
          .where("project.id = :id", { id })
          .andWhere("user.id like :userId", { userId: `%${userId || ""}%` })
          .andWhere("user.email like :email", { email: `%${email || ""}%` })
          .andWhere("user.firstName like :firstName", {
            firstName: `%${firstName || ""}%`,
          })
          .andWhere("user.lastName like :lastName", {
            lastName: `%${lastName || ""}%`,
          })
          .cache(true);

        const totalElements = await query.getCount();

        const skip: number = size * (page - 1) || 0;
        size = size === undefined || size === null ? totalElements : size;
        const sortBy = sort?.[0] ? sort[0] : "user.id";
        const sortDirection: SortDirection = sort?.[1] ? sort[1] : "ASC";

        const users: User[] = await query
          .skip(skip)
          .take(size)
          .addOrderBy(sortBy, sortDirection)
          .getMany();

        const content: UserInProjectMinimumDto[] = users.map(
          (user) =>
            ({
              id: user.id,
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email,
              name: user.userInProjects![0].name,
              isLeader: user.userInProjects![0].isLeader,
              memberType: user.userInProjects![0].type,
            }) as UserInProjectMinimumDto,
        );

        return {
          content,
          totalElements,
          totalPages: Math.floor(totalElements / size || 0),
          numberOfElements: content.length,
        } as Page<UserInProjectMinimumDto>;
      });
      res.status(200).json(data);
    } catch ({ message }) {
      next(message);
    }
  }

  static async addUserInProject(
    req: Request<unknown, unknown, AddUserInProjectDto>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { email, projectId } = req.body;
      await AppDataSource.transaction(async (appDataSource) => {
        const userRepository: Repository<User> =
          appDataSource.getRepository(User);
        const { id, firstName }: UserDto = (await userRepository.findOne({
          where: { email },
        })) as UserDto;

        if (!id) throw new Error("User doesnt exist");
        console.log(id, firstName);
        const userInProjectRepository: Repository<UserInProject> =
          appDataSource.getRepository(UserInProject);
        await userInProjectRepository.save({
          name: firstName,
          isLeader: false,
          project: {
            id: projectId,
          },
          user: {
            id,
          },
          type: UserInProjectType.MEMBER,
        });
      });
      res.status(200).json({ message: "ok" });
    } catch ({ message }) {
      if ((message as string).includes("Cannot read")) {
        message = "User does not exist";
      }
      next(message);
    }
  }
}
