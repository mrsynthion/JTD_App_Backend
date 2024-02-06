import { NextFunction, Request, Response } from "express";
import { Filters, Page, SortDirection } from "../../types/pagination.types";
import { AppDataSource } from "../../data-source";
import { User } from "../entity/User";
import { userDtoKeys, UserMinimumDto } from "../../dto/user.dto";
import {
  AddUserInProjectDto,
  EditUserInProjectDto,
  EditUserInProjectMemberTypeDto,
  UserInProjectDto,
  UserInProjectMinimumDto,
} from "../../dto/user-in-project.dto";
import { Repository } from "typeorm";
import { UserInProject } from "../entity/UserInProject";
import { UserInProjectType } from "../../types/user.types";
import {
  mapUserInProjectToUserInProjectDto,
  mapUserInProjectToUserInProjectMinimumDto,
} from "../../utils/user-in-project.utils";
import {
  getDataFromTokenByKey,
  getTokenFromRequest,
} from "../../utils/token-managements.utils";
import { ErrorCode } from "../../types/error.types";
import { Project } from "../entity/Project";

export class UserInProjectController {
  static async addUserInProject(
    req: Request<{ projectId: string }, unknown, AddUserInProjectDto>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { projectId } = req.params;
      const { email } = req.body;
      await AppDataSource.transaction(async (appDataSource) => {
        const userRepository: Repository<User> =
          appDataSource.getRepository(User);
        const { id, firstName }: UserMinimumDto = (await userRepository.findOne(
          {
            where: { email },
          },
        )) as UserMinimumDto;

        if (!id) throw new Error("User doesnt exist");
        const userInProjectRepository: Repository<UserInProject> =
          appDataSource.getRepository(UserInProject);
        await userInProjectRepository.save({
          name: firstName,
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

  static async getUserPageByProjectId(
    req: Request<
      { projectId: string },
      Page<UserInProjectMinimumDto>,
      unknown,
      Filters<UserInProjectMinimumDto>
    >,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { projectId } = req.params;
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
          .getRepository(UserInProject)
          .createQueryBuilder("userInProject")
          .leftJoin("userInProject.user", "user")
          .leftJoin("userInProject.project", "project")
          .leftJoin("userInProject.leader", "leader")
          .select([
            "user.id",
            "user.firstName",
            "user.lastName",
            "user.email",
            "userInProject.id",
            "userInProject.name",
            "userInProject.type",
            "leader.id",
          ])
          .where("project.id = :projectId", { projectId })
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

        let sortBy = "user.id";
        if (sort && sort[0]) {
          sortBy = userDtoKeys.find((key) => key === sort[0])
            ? `user.${sort[0]}`
            : sort[0];
        }

        const sortDirection: SortDirection = sort && sort[1] ? sort[1] : "ASC";

        const users: UserInProject[] = await query
          .skip(skip)
          .take(size)
          .addOrderBy(sortBy, sortDirection)
          .getMany();

        const content: UserInProjectMinimumDto[] = users.map((user) =>
          mapUserInProjectToUserInProjectMinimumDto(user),
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

  static async getUserByUserIdAndProjectId(
    req: Request<{ userId: string; projectId: string }>,
    res: Response<UserInProjectDto>,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { userId, projectId } = req.params;
      await AppDataSource.transaction(async (appDataSource) => {
        const userInProjectRepository: Repository<UserInProject> =
          appDataSource.getRepository(UserInProject);
        const projectRepository: Repository<Project> =
          appDataSource.getRepository(Project);
        const userInProject: UserInProject = (await userInProjectRepository
          .createQueryBuilder("userInProject")
          .select("userInProject.name")
          .addSelect("userInProject.type")
          .addSelect("userInProject.projectId")
          .addSelect("user.id")
          .addSelect("user.firstName")
          .addSelect("user.lastName")
          .addSelect("user.email")
          .addSelect("task.id")
          .addSelect("task.type")
          .leftJoin("userInProject.user", "user")
          .leftJoin("userInProject.tasks", "task")
          .leftJoinAndSelect("userInProject.leader", "isLeader")
          .where("user.id = :userId", { userId })
          .andWhere("userInProject.projectId = :projectId", { projectId })
          .getOne()) as UserInProject;

        const user: UserInProjectDto =
          mapUserInProjectToUserInProjectDto(userInProject);

        res.status(200).json(user);
      });
    } catch ({ message }) {
      next(message);
    }
  }

  static async editCurrentUserDataByProjectId(
    req: Request<{ projectId: string }, unknown, EditUserInProjectDto>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const token = getTokenFromRequest(req);
      const { id } = getDataFromTokenByKey(token, "user");
      const { projectId } = req.params;
      const editUserInProject: EditUserInProjectDto = req.body;

      const userInProjectRepository =
        AppDataSource.getRepository(UserInProject);

      const isUserExist: boolean = await userInProjectRepository.exist({
        where: {
          project: {
            id: projectId,
          },
          user: { id },
        },
      });
      if (!isUserExist) throw new Error(ErrorCode.UCNFU);

      await userInProjectRepository.update(
        {
          project: {
            id: projectId,
          },
          user: { id },
        },
        editUserInProject,
      );

      res.status(200).json({ message: "ok" });
    } catch (e) {
      if (e instanceof Error) {
        next(e.message);
      }
    }
  }

  static async editMemberTypeByUserIdAndProjectId(
    req: Request<
      { userId: string; projectId: string },
      unknown,
      EditUserInProjectMemberTypeDto
    >,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { userId: id, projectId } = req.params;
      const { memberType: type }: EditUserInProjectMemberTypeDto = req.body;

      const userInProjectRepository =
        AppDataSource.getRepository(UserInProject);

      const isUserExist: boolean = await userInProjectRepository.exist({
        where: {
          project: {
            id: projectId,
          },
          user: { id },
        },
      });
      if (!isUserExist) throw new Error(ErrorCode.UCNFU);

      await userInProjectRepository.update(
        {
          project: {
            id: projectId,
          },
          user: { id },
        },
        { type },
      );

      res.status(200).json({ message: "ok" });
    } catch (e) {
      if (e instanceof Error) {
        next(e.message);
      }
    }
  }
}
