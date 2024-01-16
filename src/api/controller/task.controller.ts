import { AppDataSource } from "../../data-source";
import { sendError } from "../../utils/error.utils";
import { Response } from "express";
import { ErrorCode } from "../../global-types/error.types";
import { Task } from "../entity/Task";
import { validateTitle } from "../../utils/task.utils";
import {
  Filters,
  Page,
  SortBy,
  SortDirection,
} from "../../global-types/pagination.types";
import { UserInProject } from "../entity/UserInProject";

const taskRepository = AppDataSource.getRepository(Task);

async function getTaskPage(
  userId: string,
  { title, description, createdAt, page, size, sort, id }: Filters<Task>,
  res: Response<Page<Task>>,
): Promise<void> {
  try {
    const data = await AppDataSource.transaction(async (appDataSource) => {
      const totalElements = await appDataSource
        .getRepository(Task)
        .createQueryBuilder("task")
        .where("task.userId = :userId", { userId })
        .andWhere(id ? "task.id like :id" : "1=1", { id: `%${id || ""}%` })
        .andWhere(title ? "task.title like :title" : "1=1", {
          title: `%${title || ""}%`,
        })
        .andWhere(description ? "task.description like :description" : "1=1", {
          description: `%${description || ""}%`,
        })
        .getCount();

      const skip: number = size * (page - 1) || 0;
      size = size === undefined || size === null ? totalElements : size;
      const sortBy: SortBy<Task> = sort?.[0] ? sort[0] : "id";
      const sortDirection: SortDirection = sort?.[1] ? sort[1] : "ASC";

      const content = await appDataSource
        .getRepository(Task)
        .createQueryBuilder("task")
        .select([
          "task.id",
          "task.title",
          "task.importanceLevel",
          "task.completed",
          "task.createdAt",
          "task.expirationDate",
        ])
        .skip(skip)
        .take(size)
        .where("task.userId = :userId", { userId })
        .andWhere(id ? "task.id like :id" : "1=1", { id: `%${id || ""}%` })
        .andWhere(title ? "task.title like :title" : "1=1", {
          title: `%${title || ""}%`,
        })
        .andWhere(description ? "task.description like :description" : "1=1", {
          description: `%${description || ""}%`,
        })
        .addOrderBy(sortBy, sortDirection)
        .getMany();

      return {
        content,
        totalElements,
        totalPages: Math.floor(totalElements / size || 0),
        numberOfElements: content.length,
      } as Page<Task>;
    });
    res.statusCode = 200;
    res.json(data);
  } catch ({ message }) {
    sendError(400, message, res);
  }
}

async function getCertainTask(id: string, res: Response): Promise<void> {
  try {
    const task: Task = await taskRepository.findOne({
      where: {
        id,
      },
    });
    res.statusCode = 200;
    res.json(task);
  } catch ({ message }) {
    sendError(400, message, res);
  }
}

async function addTask(
  userId: string,
  task: Task,
  res: Response<Task>,
): Promise<void> {
  try {
    if (task.title) validateTitle(task.title);
    task = { ...task, assignedUser: { id: userId } as UserInProject };
    const newTask: Task = await taskRepository.save(task);
    res.statusCode = 200;
    res.json(newTask);
  } catch ({ message }) {
    let newMessage: ErrorCode = message;
    sendError(400, newMessage, res);
  }
}

async function editCertainTask(
  id: string,
  task: Task,
  res: Response<Task>,
): Promise<void> {
  try {
    delete task["id"];
    if (task.title) validateTitle(task.title);
    await taskRepository.save(task);
    const newTask: Task = await taskRepository.findOneBy({ id });
    res.statusCode = 200;
    res.json(newTask);
  } catch ({ message }) {
    let newMessage: ErrorCode = message;
    sendError(400, newMessage, res);
  }
}

export const TaskControllerFunctions = {
  getTaskPage,
  getCertainTask,
  addTask,
  editCertainTask,
};
