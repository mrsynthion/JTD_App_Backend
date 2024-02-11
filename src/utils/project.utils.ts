import { ProjectManagementType, ProjectTypes } from "../types/project.types";
import { ErrorCode } from "../types/error.types";
import { Repository } from "typeorm";
import { AppDataSource } from "../data-source";
import { UserInProject } from "../api/entity/UserInProject";
import { Project } from "../api/entity/Project";
import { UserInProjectType } from "../types/user.types";
import {
  AddProjectDto,
  EditProjectDto,
  ProjectBasicDto,
} from "../dto/project.dto";
import { UserInProjectBasicDto } from "../dto/user-in-project.dto";

const userInProjectRepository: Repository<UserInProject> =
  AppDataSource.getRepository(UserInProject);

const projectRepository: Repository<Project> =
  AppDataSource.getRepository(Project);

function validateAddProjectKey(key: string | undefined): void {
  if (!key) throw new Error(ErrorCode.PROJECT_KIR);
  if (key?.length > 10) throw new Error(ErrorCode.PROJECT_KMBMTC);
}

function validateAddProjectName(name: string | undefined): void {
  if (!name) throw new Error(ErrorCode.PROJECT_NIR);
}

function validateAddProjectType(type: ProjectTypes | undefined): void {
  const isValidType: boolean = !!Object.values(ProjectTypes).find(
    (projectType) => projectType === type,
  );
  if (!isValidType) {
    throw new Error(ErrorCode.PROJECT_TIR);
  }
}

function validateAddProjectManagementType(
  type: ProjectManagementType | undefined,
): void {
  const isValidProjectManagementType: boolean = !!Object.values(
    ProjectManagementType,
  ).find((projectManagementType) => projectManagementType === type);
  if (!isValidProjectManagementType) {
    throw new Error(ErrorCode.PROJECT_MTIR);
  }
}

function validateAddProjectUserInProjectType(
  type: UserInProjectType | undefined,
): void {
  const isValidUserInProjectType: boolean = !!Object.values(
    UserInProjectType,
  ).find((userInProjectType) => userInProjectType === type);
  if (!isValidUserInProjectType) {
    throw new Error(ErrorCode.PROJECT_UIPTIR);
  }
}

export async function validateAddProjectData(
  addProject: AddProjectDto,
): Promise<void> {
  validateAddProjectKey(addProject.key);
  validateAddProjectName(addProject.name);
  validateAddProjectType(addProject.type);
  validateAddProjectManagementType(addProject.projectManagementType);
}

function validateEditProjectKey(key: string | undefined): boolean {
  if (!key) return false;
  if (key?.length > 10) throw new Error(ErrorCode.PROJECT_KMBMTC);
  return true;
}

function validateEditProjectName(name: string | undefined): boolean {
  return !!name;
}

async function validateEditProjectLeader(
  leader: UserInProjectBasicDto | null | undefined,
): Promise<boolean> {
  if (!leader?.id) return false;
  const isLeaderExist: boolean = await userInProjectRepository.exist({
    where: {
      user: {
        id: leader.id,
      },
    },
  });
  if (!isLeaderExist) throw new Error(ErrorCode.PROJECT_NLME);
  return true;
}

async function validateIfProjectExistById(
  id: string | undefined,
): Promise<boolean> {
  try {
    const isProjectExist: boolean = await projectRepository.exist({
      where: { id },
    });
    if (!isProjectExist) throw new Error(ErrorCode.PROJECT_PDSE);
    return true;
  } catch (e) {
    throw new Error(ErrorCode.PROJECT_PME);
  }
}

export async function validateEditProjectData(
  editProject: EditProjectDto,
  id: string | undefined,
): Promise<Set<keyof EditProjectDto>> {
  const set: Set<keyof EditProjectDto> = new Set();
  await validateIfProjectExistById(id);
  if (validateEditProjectKey(editProject.key)) set.add("key");
  if (validateEditProjectName(editProject.name)) set.add("name");
  if (!!editProject.type) set.add("type");
  if (!!editProject.projectManagementType) {
    set.add("projectManagementType");
  }
  if (!set.size) throw new Error(ErrorCode.PROJECT_YMPMOVTC);
  return set;
}

export function mapProjectToProjectMinimumDto(
  project: Project,
): ProjectBasicDto {
  return {
    id: project.id,
    name: project.name,
    key: project.key,
    type: project.type,
    projectManagementType: project.projectManagementType,
  };
}
