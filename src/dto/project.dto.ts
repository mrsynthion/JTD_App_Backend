import { ProjectManagementType, ProjectType } from "../types/projectType";
import { UserDto, UserInProjectMinimumDto } from "./user.dto";

export interface ProjectDto {
  id: string;
  name: string;
  key: string;
  type: ProjectType;
  leader: UserInProjectMinimumDto;
  users: UserInProjectMinimumDto[];
  projectManagementType: ProjectManagementType;
}

export interface ProjectMinimumDto {
  id: string;
  name: string;
  key: string;
  type: ProjectType;
  projectManagementType: ProjectManagementType;
}

export interface AddProjectDto {
  name: string;
  key: string;
  type: ProjectType;
  projectManagementType: ProjectManagementType;
}

export interface EditProjectDto {
  name?: string;
  key?: string;
  type?: ProjectType;
  projectManagementType?: ProjectManagementType;
  leader?: UserDto;
}
