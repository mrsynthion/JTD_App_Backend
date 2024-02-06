import { ErrorCode } from "../types/error.types";
import { AddTaskDto, TaskDto, TaskMinimumDto } from "../dto/task.dto";
import { TaskType } from "../types/task.types";
import { Task } from "../api/entity/Task";
import { mapUserInProjectToUserInProjectMinimumDto } from "./user-in-project.utils";

function validateTitle(title: string): void {
  if (!title) throw new Error(ErrorCode.TTIR);
  if (title && title.length < 5) throw new Error(ErrorCode.TTMBMFC);
}

function validateType(type: TaskType): void {
  if (!type) throw new Error(ErrorCode.TTTIR);
}

function validateTypeAndParentTask(
  type: TaskType,
  parentTask: TaskMinimumDto | null,
): void {
  if (type === TaskType.EPIC && parentTask?.id) {
    throw new Error(ErrorCode.TTECNHPT);
  }
}

export function validateAddTaskDto(addTaskDto: AddTaskDto): void {
  validateTitle(addTaskDto.title);
  validateType(addTaskDto.type);
  validateTypeAndParentTask(addTaskDto.type, addTaskDto.parentTask);
}

export function mapTaskToTaskMinimumDto(task: Task): TaskMinimumDto {
  return {
    id: task.id,
    title: task.title,
    description: task.description,
    label: task.label,
    type: task.type,
    status: task.status,
    assignedUser: task.assignedUser
      ? mapUserInProjectToUserInProjectMinimumDto(task.assignedUser)
      : null,
    createdAt: task.createdAt,
  };
}

export function mapTaskToTaskDto(task: Task): TaskDto {
  console.log(task);
  return {
    id: task.id,
    title: task.title,
    description: task.description,
    label: task.label,
    type: task.type,
    status: task.status,
    assignedUser: task.assignedUser
      ? mapUserInProjectToUserInProjectMinimumDto(task.assignedUser)
      : null,
    createdAt: task.createdAt,
    childrenTasks: task.childrenTasks
      ? task.childrenTasks.map((t) => mapTaskToTaskMinimumDto(t))
      : null,
    parentTask: task.parentTask
      ? mapTaskToTaskMinimumDto(task.parentTask)
      : null,
    worklogs: task.worklogs,
  };
}
