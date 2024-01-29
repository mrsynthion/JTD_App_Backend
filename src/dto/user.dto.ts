import { ProjectMinimumDto } from "./project.dto";
import { UserInProjectType } from "../types/user.types";
import { Task } from "../api/entity/Task";

export interface UserDto {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export type EditUserDto = UserDto & {
  password: string;
};

export type UserWithProjectsDto = UserDto & {
  projects: ProjectMinimumDto[];
};

export type UserInProjectMinimumDto = UserDto & {
  name: string;
  isLeader: boolean;
  memberType: UserInProjectType;
};

export type UserInProjectDto = UserInProjectMinimumDto & {
  tasks: Task[];
};
