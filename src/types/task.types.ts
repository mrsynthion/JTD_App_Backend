import { AddTaskDto, TaskMinimumDto } from "../dto/task.dto";

export enum TaskType {
  EPIC = "EPIC",
  STORY = "STORY",
  TASK = "TASK",
  BUG = "BUG",
  SUB_TASK = "SUB_TASK",
  SUB_BUG = "SUB_BUG",
}

export enum TaskStatus {
  TO_DO = "TO_DO",
  IN_PROGRESS = "IN_PROGRESS",
  CODE_REVIEW = "CODE_REVIEW",
  READY_FOR_TEST = "READY_FOR_TEST",
  IN_TEST = "IN_TEST",
  DONE = "DONE",
  WONT_DO = "WONT_DO",
  BLOCKED = "BLOCKED",
}

export const taskDtoKeys: (keyof TaskMinimumDto)[] = [
  "id",
  "title",
  "description",
  "createdAt",
  "type",
  "status",
  "label",
];

export type AddTaskType = AddTaskDto & {
  status: TaskStatus;
  createdAt: Date;
  project: {
    id: string;
  };
};
