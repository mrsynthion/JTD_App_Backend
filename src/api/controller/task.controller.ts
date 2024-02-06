import { AppDataSource } from "../../data-source";
import { NextFunction, Request, Response } from "express";
import { ErrorCode } from "../../types/error.types";
import { Task } from "../entity/Task";
import { Filters, Page, SortDirection } from "../../types/pagination.types";
import { AddTaskDto, TaskDto, TaskMinimumDto } from "../../dto/task.dto";
import { AddTaskType, taskDtoKeys, TaskStatus } from "../../types/task.types";
import { Repository } from "typeorm";
import {
  mapTaskToTaskDto,
  mapTaskToTaskMinimumDto,
  validateAddTaskDto,
} from "../../utils/task.utils";

export class TaskController {
  static async getCertainTask(
    req: Request<{ id: string }, TaskDto>,
    res: Response<TaskDto>,
    next: NextFunction,
  ): Promise<void> {
    console.log(1);
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
        ])
        .leftJoinAndSelect("task.assignedUser", "userInProject")
        .leftJoinAndSelect("userInProject.user", "user")
        .leftJoinAndSelect("task.worklogs", "worklog")
        .leftJoinAndSelect("task.parentTask", "parentTask")
        .leftJoinAndSelect("task.childrenTasks", "childrenTask")
        .where("task.id = :id", { id })
        .getOne()) as Task;

      const taskDto: TaskDto = mapTaskToTaskDto(task);

      res.status(200).json(taskDto);
    } catch ({ message }) {
      throw new Error(message as ErrorCode);
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
      const task: TaskMinimumDto = mapTaskToTaskMinimumDto(savedTask);
      res.status(200).json(task);
    } catch ({ message }) {
      let newMessage: ErrorCode = message as ErrorCode;
      throw new Error(newMessage);
    }
  }

  static async getTaskPageByProjectId(
    req: Request<
      { projectId: string },
      Page<TaskMinimumDto>,
      unknown,
      Filters<TaskMinimumDto>
    >,
    res: Response<Page<TaskMinimumDto>>,
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
        sort,
        size,
        page,
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
            "assignedUser.id",
            "assignedUser.name",
            "assignedUser.type",
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

        const content = await query
          .skip(skip)
          .take(size)
          .addOrderBy(sortBy, sortDirection)
          .getMany();

        const taskPage = {
          content,
          totalElements,
          totalPages: Math.floor(totalElements / size || 0),
          numberOfElements: content.length,
        } as Page<TaskMinimumDto>;
        res.status(200).json(taskPage);
      });
    } catch ({ message }) {
      throw new Error(message as ErrorCode);
    }
  }
}

//
// async function editCertainTask(
//   id: string,
//   task: Task,
//   res: Response,
// ): Promise<void> {
//   try {
//     if (task.title) validateTitle(task.title);
//     await taskRepository.update({ id }, task);
//     res.statusCode = 200;
//     res.json({ message: "ok" });
//   } catch ({ message }) {
//     let newMessage: ErrorCode = message as ErrorCode;
//     throw new Error(newMessage);
//   }
// }
