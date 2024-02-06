import { TaskStatus, TaskType } from "../types/task.types";
import { UserInProjectMinimumDto } from "./user-in-project.dto";
import { WorklogDto } from "./worklog.dto";

export interface TaskMinimumDto {
  id: string;
  title: string;
  description: string;
  label: string;
  type: TaskType;
  status: TaskStatus;
  assignedUser: UserInProjectMinimumDto | null;
  createdAt: Date;
}

export type TaskDto = TaskMinimumDto & {
  childrenTasks: TaskMinimumDto[] | null;
  parentTask: TaskMinimumDto | null;
  worklogs: WorklogDto[];
};

export interface AddTaskDto {
  title: string;
  description: string;
  label: string;
  type: TaskType;
  assignedUser: UserInProjectMinimumDto | null;
  parentTask: TaskMinimumDto | null;
}
