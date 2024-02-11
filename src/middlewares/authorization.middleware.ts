import { NextFunction, Request, Response } from "express";
import * as dotenv from "dotenv";
import {
  getDataFromTokenByKey,
  getTokenFromRequest,
} from "../utils/token-managements.utils";
import { UserInProjectType } from "../types/user.types";
import { RoutePath } from "../types/routes.types";
import { Repository } from "typeorm";
import { AppDataSource } from "../data-source";
import { UserInProject } from "../api/entity/UserInProject";
import { Task } from "../api/entity/Task";
import { HttpCode } from "../types/http.types";
import { ErrorCode, ServerError } from "../types/error.types";

dotenv.config();
const sendForbiddenResponse = (res: Response<ServerError>) =>
  res.status(HttpCode.FORBIDDEN).json({ message: ErrorCode.SERVER_FOR });

const checkUserAndUserRole = (
  userInProject: UserInProject | null,
  roles: UserInProjectType[],
) => userInProject && roles.includes(userInProject.type);

export const AuthorizationMiddleware = (...roles: UserInProjectType[]) => {
  return async (
    req: Request,
    res: Response<ServerError>,
    next: NextFunction,
  ) => {
    try {
      const token = getTokenFromRequest(req);
      const user = getDataFromTokenByKey(token, "user");
      switch (req.baseUrl) {
        case RoutePath.PROJECT: {
          const { id } = req.params;
          const userInProjectRepository: Repository<UserInProject> =
            AppDataSource.getRepository(UserInProject);
          const userInProject = await userInProjectRepository.findOne({
            where: {
              user,
              project: {
                id,
              },
            },
          });
          if (checkUserAndUserRole(userInProject, roles)) {
            return next();
          }
          return sendForbiddenResponse(res);
        }

        case RoutePath.USER_IN_PROJECT: {
          const { projectId } = req.params;
          const userInProjectRepository: Repository<UserInProject> =
            AppDataSource.getRepository(UserInProject);
          const userInProject = await userInProjectRepository.findOne({
            where: {
              user,
              project: {
                id: projectId,
              },
            },
          });
          if (checkUserAndUserRole(userInProject, roles)) {
            return next();
          }
          return sendForbiddenResponse(res);
        }

        case RoutePath.TASK: {
          const { id, projectId } = req.params;

          const userInProjectRepository: Repository<UserInProject> =
            AppDataSource.getRepository(UserInProject);

          if (id) {
            const taskRepository: Repository<Task> =
              AppDataSource.getRepository(Task);
            const task = await taskRepository
              .createQueryBuilder("task")
              .select(["project.id"])
              .leftJoin("task.project", "project")
              .where("task.id = :id", { id })
              .getOne();

            const userInProject = await userInProjectRepository.findOne({
              where: {
                user,
                project: {
                  id: task?.project.id,
                },
              },
            });
            if (checkUserAndUserRole(userInProject, roles)) {
              return next();
            }
            return sendForbiddenResponse(res);
          }

          if (projectId) {
            const userInProject = await userInProjectRepository.findOne({
              where: {
                user,
                project: {
                  id: projectId,
                },
              },
            });
            if (checkUserAndUserRole(userInProject, roles)) {
              return next();
            }
            return sendForbiddenResponse(res);
          }
          return sendForbiddenResponse(res);
        }

        case RoutePath.WORK_LOG: {
          const { id, taskId } = req.params;
          const userInProjectRepository: Repository<UserInProject> =
            AppDataSource.getRepository(UserInProject);

          if (id) {
            const taskRepository: Repository<Task> =
              AppDataSource.getRepository(Task);
            const task = await taskRepository
              .createQueryBuilder("task")
              .select(["task.id", "project.id"])
              .leftJoin("task.workLogs", "workLog")
              .leftJoin("task.project", "project")
              .where("workLog.id  = :workLogId", { workLogId: id })
              .getOne();

            const userInProject = await userInProjectRepository.findOne({
              where: {
                user,
                project: {
                  id: task?.project.id,
                },
              },
            });
            if (checkUserAndUserRole(userInProject, roles)) {
              return next();
            }
          }

          if (taskId) {
            const taskRepository: Repository<Task> =
              AppDataSource.getRepository(Task);
            const task = await taskRepository
              .createQueryBuilder("task")
              .select(["task.id", "project.id"])
              .leftJoin("task.project", "project")
              .where("task.id  = :taskId", { taskId })
              .getOne();

            const userInProject = await userInProjectRepository.findOne({
              where: {
                user,
                project: {
                  id: task?.project.id,
                },
              },
            });
            if (checkUserAndUserRole(userInProject, roles)) {
              return next();
            }
          }

          return sendForbiddenResponse(res);
        }
        default: {
          next();
        }
      }
      next();
    } catch (error) {
      return sendForbiddenResponse(res);
    }
  };
};
