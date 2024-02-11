import { AppDataSource } from "../../data-source";
import { NextFunction, Request, Response } from "express";
import { Task } from "../entity/Task";
import { Filters, Page, SortDirection } from "../../types/pagination.types";
import {
  AddTaskDto,
  EditTaskDto,
  TaskBasicDto,
  TaskDto,
} from "../../dto/task.dto";
import { AddTaskType, taskDtoKeys, TaskStatus } from "../../types/task.types";
import { Repository } from "typeorm";
import {
  mapTaskToTaskBasicDto,
  mapTaskToTaskDto,
  validateAddTaskDto,
  validateDeleteTaskDto,
  validateEditTaskDto,
  validateTaskStatus,
} from "../../utils/task.utils";
import { UserInProjectBasicDto } from "../../dto/user-in-project.dto";
import { UserInProject } from "../entity/UserInProject";
import { HttpCode, successMessage } from "../../types/http.types";

export class TaskController {
  static async getCertainTask(
    req: Request<{ id: string }, TaskDto>,
    res: Response<TaskDto>,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = req.params;
      const taskRepository: Repository<Task> =
        AppDataSource.getRepository(Task);
      const task: Task = (await taskRepository
        .createQueryBuilder("task")
        .select([
          "task.id",
          "task.title",
          "task.description",
          "task.createdAt",
          "task.label",
          "task.type",
          "task.status",
          "userInProject.name",
          "userInProject.type",
          "user.id",
          "user.firstName",
          "user.lastName",
          "user.email",
          "leader.id",
          "parentTask.id",
          "parentTask.title",
          "parentTask.description",
          "parentTask.createdAt",
          "parentTask.label",
          "parentTask.type",
          "parentTask.status",
          "childrenTask.id",
          "childrenTask.title",
          "childrenTask.description",
          "childrenTask.createdAt",
          "childrenTask.label",
          "childrenTask.type",
          "childrenTask.status",
        ])
        .leftJoin("task.assignedUser", "userInProject")
        .leftJoin("userInProject.user", "user")
        .leftJoin("userInProject.leader", "leader")
        .leftJoinAndSelect("task.workLogs", "workLog")
        .leftJoin("task.parentTask", "parentTask")
        .leftJoin("task.childrenTasks", "childrenTask")
        .where("task.id = :id", { id })
        .getOne()) as Task;

      const taskDto: TaskDto = mapTaskToTaskDto(task);

      res.status(HttpCode.SUCCESS).json(taskDto);
    } catch ({ message }) {
      next(message);
    }
  }

  static async editCertainTask(
    req: Request<{ id: string }, unknown, EditTaskDto>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const { id } = req.params;
    const editTask = req.body;
    try {
      validateEditTaskDto(editTask);
      const taskRepository: Repository<Task> =
        AppDataSource.getRepository(Task);
      await taskRepository.update({ id }, editTask);
      res.status(HttpCode.SUCCESS).json(successMessage);
    } catch ({ message }) {
      next(message);
    }
  }

  static async changeTaskAssignedUser(
    req: Request<{ id: string }, unknown, UserInProjectBasicDto>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = req.params;
      const assignedUser: UserInProjectBasicDto = req.body;

      const userInProjectRepository: Repository<UserInProject> =
        AppDataSource.getRepository(UserInProject);
      const userInProject: UserInProject = (await userInProjectRepository
        .createQueryBuilder("userInProject")
        .select(["userInProject.id"])
        .leftJoin("userInProject.user", "user")
        .where({ user: { id: assignedUser.id } })
        .getOne()) as UserInProject;

      const taskRepository: Repository<Task> =
        AppDataSource.getRepository(Task);
      await taskRepository.update({ id }, { assignedUser: userInProject });
      res.status(HttpCode.SUCCESS).json(successMessage);
    } catch ({ message }) {
      next(message);
    }
  }

  static async deleteCertainTask(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const { id } = req.params;
    try {
      const taskRepository: Repository<Task> =
        AppDataSource.getRepository(Task);

      const task: Task | null = await taskRepository
        .createQueryBuilder("task")
        .select(["task.id", "childrenTask.id"])
        .leftJoin("task.parentTask", "parentTask")
        .leftJoin("task.childrenTasks", "childrenTask")
        .where("task.id = :id", { id })
        .getOne();

      validateDeleteTaskDto(task);

      await taskRepository.delete({ id });
      res.status(HttpCode.SUCCESS).json(successMessage);
    } catch ({ message }) {
      next(message);
    }
  }

  static async changeTaskStatus(
    req: Request<{ id: string; status: TaskStatus }>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id, status } = req.params;
      validateTaskStatus(status);
      const taskRepository: Repository<Task> =
        AppDataSource.getRepository(Task);
      await taskRepository.update({ id }, { status });
      res.status(HttpCode.SUCCESS).json(successMessage);
    } catch ({ message }) {
      next(message);
    }
  }

  static async addTaskByProjectId(
    req: Request<{ projectId: string }, unknown, AddTaskDto>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { projectId } = req.params;
      const addTask = req.body;
      const addTaskType: AddTaskType = {
        ...addTask,
        status: TaskStatus.TO_DO,
        createdAt: new Date(Date.now()),
        project: {
          id: projectId,
        },
      };
      validateAddTaskDto(addTask);
      const taskRepository: Repository<Task> =
        AppDataSource.getRepository(Task);
      const savedTask = (await taskRepository.save(addTaskType)) as Task;
      const task: TaskBasicDto = mapTaskToTaskBasicDto(savedTask);
      res.status(HttpCode.SUCCESS).json(task);
    } catch ({ message }) {
      next(message);
    }
  }

  static async getTaskPageByProjectId(
    req: Request<
      { projectId: string },
      Page<TaskBasicDto>,
      unknown,
      Filters<TaskBasicDto>
    >,
    res: Response<Page<TaskBasicDto>>,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { projectId } = req.params;
      let {
        title,
        description,
        label,
        type,
        status,
        assignedUser,
        createdAt,
        sort = ["id", "ASC"],
        size = 10,
        page = 1,
      } = req.query;
      const data = await AppDataSource.transaction(async (appDataSource) => {
        const query = appDataSource
          .getRepository(Task)
          .createQueryBuilder("task")
          .select([
            "task.id",
            "task.title",
            "task.description",
            "task.label",
            "task.type",
            "task.status",
            "task.createdAt",
            "user.id",
            "assignedUser.name",
          ])
          .where("project.id = :projectId", { projectId })
          .andWhere("task.title like :title", { title: `%${title || ""}%` })
          .andWhere("task.description like :description", {
            description: `%${description || ""}%`,
          })
          .andWhere(
            label
              ? "task.label like :label"
              : "task.label like :label OR task.label IS NULL",
            { label: `%${label || ""}%` },
          )
          .andWhere("task.type like :type", { type: `%${type || ""}%` })
          .andWhere("task.status like :status", { status: `%${status || ""}%` })
          .andWhere("task.createdAt like :createdAt", {
            createdAt: `%${createdAt || ""}%`,
          })
          .andWhere(
            assignedUser?.id ? "assignedUser.id = :assignedUserId" : "1=1",
            {
              assignedUserId: assignedUser?.id,
            },
          )
          .leftJoin("task.project", "project")
          .leftJoin("task.assignedUser", "assignedUser")
          .leftJoin("assignedUser.user", "user")
          .cache(true);
        const totalElements = await query.getCount();

        const skip: number = size * (page - 1) || 0;
        size = size === undefined || size === null ? totalElements : size;
        let sortBy = "task.id";
        if (sort && sort[0]) {
          sortBy = taskDtoKeys.find((key) => key === sort[0])
            ? `task.${sort[0]}`
            : sort[0];
        }
        const sortDirection: SortDirection = sort?.[1] ? sort[1] : "ASC";

        const taskList = await query
          .skip(skip)
          .take(size)
          .addOrderBy(sortBy, sortDirection)
          .getMany();

        const content: TaskBasicDto[] = taskList.map((task) =>
          mapTaskToTaskBasicDto(task),
        );

        const taskPage = {
          content,
          totalElements,
          totalPages: Math.floor(totalElements / size || 0),
          numberOfElements: content.length,
        } as Page<TaskBasicDto>;
        res.status(HttpCode.SUCCESS).json(taskPage);
      });
    } catch ({ message }) {
      next(message);
    }
  }
}
