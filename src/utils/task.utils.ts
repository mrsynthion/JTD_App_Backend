import { ErrorCode } from "../types/error.types";
import {
  AddTaskDto,
  EditTaskDto,
  TaskBasicDto,
  TaskDto,
} from "../dto/task.dto";
import { TaskStatus, TaskType } from "../types/task.types";
import { Task } from "../api/entity/Task";
import {
  mapUserInProjectToUserInProjectBasicDto,
  mapUserInProjectToUserInProjectMinimumDto,
} from "./user-in-project.utils";

function validateTitle(title?: string, edit?: boolean): void {
  if (!title && !edit) throw new Error(ErrorCode.TASK_TIR);
  if (title && title.length < 5) throw new Error(ErrorCode.TASK_TMBMFC);
}

function validateType(type?: TaskType): void {
  if (!type) throw new Error(ErrorCode.TASK_TTIR);
}

function validateTypeAndParentTask(
  type?: TaskType,
  parentTask?: TaskBasicDto | null,
): void {
  if (type === TaskType.EPIC && parentTask?.id) {
    throw new Error(ErrorCode.TASK_TECNHPT);
  }
}

function validateTaskExist(id?: string): void {
  if (!id) throw new Error(ErrorCode.TASK_TME);
}

function validateTaskChildren(children?: Task[]): void {
  if (children && children.length !== 0) throw new Error(ErrorCode.TASK_TTCNHC);
}

export function validateTaskStatus(status?: TaskStatus) {
  const statusFound: boolean = !!Object.values(TaskStatus).find(
    (s) => s === status,
  );

  if (status && !statusFound) throw new Error(ErrorCode.TASK_TSME);
}

export function validateAddTaskDto(addTaskDto: AddTaskDto): void {
  validateTitle(addTaskDto.title);
  validateType(addTaskDto.type);
  validateTypeAndParentTask(addTaskDto.type, addTaskDto.parentTask);
}

export function validateEditTaskDto(editTaskDto: EditTaskDto): void {
  validateTitle(editTaskDto.title, true);
  validateTaskStatus(editTaskDto.status);
  validateTypeAndParentTask(editTaskDto.type, editTaskDto.parentTask);
}

export function validateDeleteTaskDto(deleteTaskDto: Task | null): void {
  validateTaskExist(deleteTaskDto?.id);
  validateTaskChildren(deleteTaskDto?.childrenTasks);
}

export function mapTaskToTaskBasicDto(task: Task): TaskBasicDto {
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
  return {
    id: task.id,
    title: task.title,
    description: task.description,
    label: task.label,
    type: task.type,
    status: task.status,
    assignedUser: task.assignedUser
      ? mapUserInProjectToUserInProjectBasicDto(task.assignedUser)
      : null,
    createdAt: task.createdAt,
    childrenTasks: task.childrenTasks
      ? task.childrenTasks.map((t) => mapTaskToTaskBasicDto(t))
      : null,
    parentTask: task.parentTask ? mapTaskToTaskBasicDto(task.parentTask) : null,
    workLogs: task.workLogs,
  };
}
