import { ProjectManagementType, ProjectTypes } from "../types/project.types";
import { UserInProjectBasicDto } from "./user-in-project.dto";

export interface ProjectDto {
  id: string;
  name: string;
  key: string;
  type: ProjectTypes;
  leader: UserInProjectBasicDto | null;
  users: UserInProjectBasicDto[];
  projectManagementType: ProjectManagementType;
}

export interface ProjectBasicDto {
  id: string;
  name: string;
  key: string;
  type: ProjectTypes;
  projectManagementType: ProjectManagementType;
}

export interface AddProjectDto {
  name: string;
  key: string;
  type: ProjectTypes;
  projectManagementType: ProjectManagementType;
}

export interface EditProjectDto {
  name?: string;
  key?: string;
  type?: ProjectTypes;
  projectManagementType?: ProjectManagementType;
}

export interface EditProjectLeaderDto {
  leaderId: string;
}
