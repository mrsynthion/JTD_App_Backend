import { UserMinimumDto } from "./user.dto";
import { UserInProjectType } from "../types/user.types";
import { Task } from "../api/entity/Task";

export interface AddUserInProjectDto {
  email: string;
}

export interface EditUserInProjectDto {
  name: string;
}

export interface EditUserInProjectMemberTypeDto {
  memberType: UserInProjectType;
}

export type UserInProjectMinimumDto = UserMinimumDto & {
  name: string;
  isLeader: boolean;
  memberType: UserInProjectType;
};

export type UserInProjectDto = UserInProjectMinimumDto & {
  tasks: Task[];
};
