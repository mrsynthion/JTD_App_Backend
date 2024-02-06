import { ProjectManagementType, ProjectType } from "../types/projectType";
import { UserInProjectMinimumDto } from "./user-in-project.dto";

export interface ProjectDto {
  id: string;
  name: string;
  key: string;
  type: ProjectType;
  leader: UserInProjectMinimumDto | null;
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
}

export interface EditProjectLeaderDto {
  leaderId: string;
}
