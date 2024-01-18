export class TaskType {
  id: string;
  code: number;
  value: string;
}

export interface AddTaskType {
  value: string;
}

export interface EditTaskType {
  value: string;
}
