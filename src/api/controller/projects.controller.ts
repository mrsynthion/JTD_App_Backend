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
import { TokenName } from "../../types/auth.types";
import { getDataFromTokenByKey } from "../../utils/token-managements.utils";
import { NextFunction, Request, Response } from "express";
import {
  AddProjectDto,
  EditProjectDto,
  ProjectDto,
} from "../../dto/project.dto";
import { UserDto } from "../../dto/user.dto";

const projectRepository: Repository<Project> =
  AppDataSource.getRepository(Project);

const userInProjectRepository: Repository<UserInProject> =
  AppDataSource.getRepository(UserInProject);

export class ProjectController {
  static async addProject(
    req: Request<AddProjectDto>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      let addProject: AddProjectDto = req.body;
      const token = req.cookies[TokenName];
      const currentUser: UserDto = getDataFromTokenByKey(token, "user");
      await validateAddProjectData(addProject);

      const newProject: ProjectDto = (await projectRepository.save(
        addProject,
      )) as ProjectDto;
      const addUserInProject: UserInProject = {
        name: currentUser.firstName,
        isLeader: true,
        user: currentUser,
        project: newProject,
        type: UserInProjectType.ADMINISTRATOR,
      } as UserInProject;
      const newUserInProject: UserInProject =
        await userInProjectRepository.save(addUserInProject);

      await projectRepository.update(
        { id: newProject.id },
        {
          leader: newUserInProject,
        },
      );
      const project: ProjectDto = (await projectRepository.findOne({
        where: {
          id: newProject.id,
        },
        relations: {
          leader: true,
        },
      })) as ProjectDto;
      res.status(201).json(project);
    } catch ({ message }) {
      let newMessage: ErrorCode = message as ErrorCode;
      next(newMessage);
    }
  }

  static async editProject(
    req: Request<{ id: string }, ProjectDto, EditProjectDto>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const id: string = req.params["id"];
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

      await projectRepository.update(
        {
          id,
        },
        editProjectData,
      );

      const project: ProjectDto = (await projectRepository.findOne({
        where: {
          id,
        },
        relations: {
          leader: true,
        },
      })) as ProjectDto;
      res.status(200).json(project);
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
      const id: string = req.params["id"];
      const projectFromBase: Required<Project> = (await projectRepository
        .createQueryBuilder("p")
        .select([
          "p.id",
          "p.name",
          "p.key",
          "p.type",
          "p.projectManagementType",
          "uip.name",
          "uip.isLeader",
          "uip.type",
          "uipu.id",
          "uipu.firstName",
          "uipu.lastName",
          "uipu.email",
          "l.name",
          "l.type",
          "lu.id",
          "lu.firstName",
          "lu.lastName",
          "lu.email",
        ])
        .leftJoin("p.users", "uip")
        .leftJoin("uip.user", "uipu")
        .leftJoin("p.leader", "l")
        .leftJoin("l.user", "lu")
        .where("p.id = :id", { id })
        .getOne()) as Required<Project>;

      const project: ProjectDto = {
        id: projectFromBase.id,
        name: projectFromBase.name,
        key: projectFromBase.key,
        type: projectFromBase.type,
        leader: {
          id: projectFromBase.leader.user!.id!,
          firstName: projectFromBase.leader.user!.firstName!,
          lastName: projectFromBase.leader.user!.lastName!,
          email: projectFromBase.leader.user!.email!,
          name: projectFromBase.leader.name!,
          isLeader: projectFromBase.leader.isLeader!,
          memberType: projectFromBase.leader.type!,
        },
        users: projectFromBase.users.map((user) => ({
          id: user.user!.id!,
          firstName: user.user!.firstName!,
          lastName: user.user!.lastName!,
          email: user.user!.email!,
          name: user.name!,
          isLeader: user.isLeader!,
          memberType: user.type!,
        })),
        projectManagementType: projectFromBase.projectManagementType,
      };
      res.status(200).json(project);
    } catch ({ message }) {
      next(message);
    }
  }
}
