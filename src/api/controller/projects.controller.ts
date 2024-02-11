import { Repository } from "typeorm";
import { AppDataSource } from "../../data-source";
import { Project } from "../entity/Project";
import { UserInProjectType } from "../../types/user.types";
import { UserInProject } from "../entity/UserInProject";
import {
  validateAddProjectData,
  validateEditProjectData,
} from "../../utils/project.utils";
import { ErrorCode } from "../../types/error.types";
import {
  getDataFromTokenByKey,
  getTokenFromRequest,
} from "../../utils/token-managements.utils";
import { NextFunction, Request, Response } from "express";
import {
  AddProjectDto,
  EditProjectDto,
  EditProjectLeaderDto,
  ProjectBasicDto,
  ProjectDto,
} from "../../dto/project.dto";
import { UserBasicDto } from "../../dto/user.dto";
import { mapUserInProjectToUserInProjectBasicDto } from "../../utils/user-in-project.utils";
import { HttpCode, successMessage } from "../../types/http.types";
import { SuccessMessageDto } from "../../dto/http.dto";

export class ProjectController {
  static async addProject(
    req: Request<unknown, unknown, AddProjectDto>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      let addProject: AddProjectDto = req.body;
      const token = getTokenFromRequest(req);
      const currentUser: UserBasicDto = getDataFromTokenByKey(token, "user");
      await validateAddProjectData(addProject);

      await AppDataSource.transaction(async (appDataSource) => {
        const projectRepository: Repository<Project> =
          appDataSource.getRepository(Project);

        const userInProjectRepository: Repository<UserInProject> =
          appDataSource.getRepository(UserInProject);

        const newProject: Project = (await projectRepository.save(
          addProject,
        )) as Project;

        const addUserInProject: UserInProject = {
          name: currentUser.firstName,
          user: currentUser,
          project: newProject,
          type: UserInProjectType.ADMINISTRATOR,
        } as UserInProject;

        const newUserInProject: UserInProject =
          await userInProjectRepository.save(addUserInProject);

        await projectRepository.update(
          { id: newProject.id },
          {
            leaderInProject: newUserInProject,
          },
        );

        const {
          id,
          name,
          key,
          type,
          leaderInProject,
          usersInProject,
          projectManagementType,
        }: Project = (await projectRepository
          .createQueryBuilder("project")
          .select([
            "project.id",
            "project.name",
            "project.key",
            "project.type",
            "projectManagementType",
            "usersInProject.name",
            "usersInProject.type",
            "user.id",
            "user.firstName",
            "user.lastName",
            "user.email",
            "leader.name",
            "leader.type",
            "leaderUser.id",
            "leaderUser.firstName",
            "leaderUser.lastName",
            "leaderUser.email",
          ])
          .leftJoin("project.usersInProject", "usersInProject")
          .leftJoin("usersInProject.user", "user")
          .leftJoin("project.leaderInProject", "leader")
          .leftJoin("leader.user", "leaderUser")
          .where("project.id = :id", { id: newProject.id })
          .getOne()) as Project;
        const project: ProjectDto = {
          id,
          name,
          key,
          type,
          projectManagementType,
          users: usersInProject.map((user) =>
            mapUserInProjectToUserInProjectBasicDto(user),
          ),
          leader: leaderInProject
            ? mapUserInProjectToUserInProjectBasicDto(leaderInProject)
            : null,
        };
        res.status(HttpCode.CREATED).json(project);
      });
    } catch ({ message }) {
      let newMessage: ErrorCode = message as ErrorCode;
      next(newMessage);
    }
  }

  static async getCurrentUserProjectsList(
    req: Request,
    res: Response<ProjectBasicDto[]>,
    next: NextFunction,
  ): Promise<void> {
    try {
      const token = getTokenFromRequest(req);
      const { id } = getDataFromTokenByKey(token, "user");
      const projectRepository: Repository<Project> =
        AppDataSource.getRepository(Project);

      const projectListFromBase: Project[] = (await projectRepository
        .createQueryBuilder("project")
        .select([
          "project.id",
          "project.name",
          "project.key",
          "project.type",
          "project.projectManagementType",
        ])
        .leftJoin("project.usersInProject", "userInProject")
        .leftJoin("userInProject.user", "user")
        .where("user.id = :id", { id })
        .getMany()) as Project[];

      const projectsList: ProjectBasicDto[] = projectListFromBase.map(
        (projectFromBase) => ({
          id: projectFromBase.id,
          name: projectFromBase.name,
          key: projectFromBase.key,
          type: projectFromBase.type,
          projectManagementType: projectFromBase.projectManagementType,
        }),
      );
      res.status(HttpCode.SUCCESS).json(projectsList);
    } catch ({ message }) {
      let newMessage: ErrorCode = message as ErrorCode;
      next(newMessage);
    }
  }

  static async editProject(
    req: Request<{ id: string }, SuccessMessageDto, EditProjectDto>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = req.params;
      const editProject: EditProjectDto = req.body;
      let editProjectData = {};
      const setOfKeys: Set<keyof EditProjectDto> =
        await validateEditProjectData(editProject, id);

      setOfKeys.forEach((key: keyof EditProjectDto) => {
        editProjectData = {
          ...editProjectData,
          [key]: editProject[key],
        };
      });

      const projectRepository: Repository<Project> =
        AppDataSource.getRepository(Project);

      await projectRepository.update(
        {
          id,
        },
        editProjectData,
      );

      res.status(HttpCode.SUCCESS).json(successMessage);
    } catch ({ message }) {
      next(message);
    }
  }

  static async getProjectById(
    req: Request<{ id: string }, ProjectDto>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = req.params;
      if (!id) throw new Error(ErrorCode.PROJECT_IIR);
      const projectRepository: Repository<Project> =
        AppDataSource.getRepository(Project);

      const projectFromBase: Project = (await projectRepository
        .createQueryBuilder("project")
        .select([
          "project.id",
          "project.name",
          "project.key",
          "project.type",
          "project.projectManagementType",
          "userInProject.name",
          "userInProject.type",
          "user.id",
          "user.firstName",
          "user.lastName",
          "user.email",
          "leader.name",
          "leader.type",
          "leaderUser.id",
          "leaderUser.firstName",
          "leaderUser.lastName",
          "leaderUser.email",
        ])
        .leftJoin("project.usersInProject", "userInProject")
        .leftJoin("userInProject.user", "user")
        .leftJoin("project.leaderInProject", "leader")
        .leftJoin("leader.user", "leaderUser")
        .leftJoinAndSelect("userInProject.leader", "isLeader")
        .where("project.id = :id", { id })
        .getOne()) as Project;

      const project: ProjectDto = {
        id: projectFromBase.id,
        name: projectFromBase.name,
        key: projectFromBase.key,
        type: projectFromBase.type,
        leader: projectFromBase.leaderInProject
          ? mapUserInProjectToUserInProjectBasicDto(
              projectFromBase.leaderInProject,
            )
          : null,
        users: projectFromBase.usersInProject.map((user) =>
          mapUserInProjectToUserInProjectBasicDto(user),
        ),
        projectManagementType: projectFromBase.projectManagementType,
      };
      res.status(HttpCode.SUCCESS).json(project);
    } catch ({ message }) {
      next(message);
    }
  }

  static async editProjectLeaderById(
    req: Request<{ id: string }, unknown, EditProjectLeaderDto>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = req.params;
      const { leaderId } = req.body;
      if (!id) throw new Error(ErrorCode.PROJECT_IIR);
      if (!leaderId) throw new Error(ErrorCode.PROJECT_LIIR);
      const projectRepository: Repository<Project> =
        AppDataSource.getRepository(Project);
      const userInProjectRepository: Repository<UserInProject> =
        AppDataSource.getRepository(UserInProject);

      const isProjectExist: boolean = await projectRepository.exist({
        where: { id },
      });
      if (!isProjectExist) throw new Error(ErrorCode.PROJECT_PDSE);

      const isUserInProjectExist: boolean = await userInProjectRepository.exist(
        {
          where: {
            user: {
              id: leaderId,
            },
            project: { id },
          },
        },
      );
      if (!isUserInProjectExist) {
        throw new Error(ErrorCode.PROJECT_UINMOTP);
      }

      const leaderInProject: UserInProject =
        (await userInProjectRepository.findOneBy({
          user: { id: leaderId },
          project: { id },
        })) as UserInProject;
      await projectRepository.update({ id }, { leaderInProject });

      res.status(HttpCode.SUCCESS).json(successMessage);
    } catch ({ message }) {
      next(message);
    }
  }
}
