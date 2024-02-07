import { TaskStatus, TaskType } from "../types/task.types";
import {
  UserInProjectBasicDto,
  UserInProjectMinimumDto,
} from "./user-in-project.dto";
import { WorkLogDto } from "./work-log.dto";

export interface TaskBasicDto {
  id: string;
  title: string;
  description: string;
  label: string;
  type: TaskType;
  status: TaskStatus;
  assignedUser: UserInProjectMinimumDto | null;
  createdAt: Date;
}

export type TaskDto = TaskBasicDto & {
  childrenTasks: TaskBasicDto[] | null;
  parentTask: TaskBasicDto | null;
  workLogs: WorkLogDto[];
};

export interface AddTaskDto {
  title: string;
  description: string;
  label: string;
  type: TaskType;
  assignedUser: UserInProjectBasicDto | null;
  parentTask: TaskBasicDto | null;
}

export interface EditTaskDto {
  title?: string;
  description?: string;
  label?: string;
  type?: TaskType;
  status?: TaskStatus;
  assignedUser?: UserInProjectBasicDto;
  parentTask?: TaskBasicDto | null;
  childrenTask?: TaskBasicDto;
}
