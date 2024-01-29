import { ProjectManagementType, ProjectType } from "../types/projectType";
import { ErrorCode } from "../types/error.types";
import { Repository } from "typeorm";
import { AppDataSource } from "../data-source";
import { UserInProject } from "../api/entity/UserInProject";
import { Project } from "../api/entity/Project";
import { UserInProjectType } from "../types/user.types";
import { AddProjectDto, EditProjectDto } from "../dto/project.dto";

const userInProjectRepository: Repository<UserInProject> =
  AppDataSource.getRepository(UserInProject);

const projectRepository: Repository<Project> =
  AppDataSource.getRepository(Project);

function validateAddProjectKey(key: string | undefined): void {
  if (!key) throw new Error(ErrorCode.PKIR);
  if (key?.length > 10) throw new Error(ErrorCode.PKMBMTC);
}

function validateAddProjectName(name: string | undefined): void {
  if (!name) throw new Error(ErrorCode.PNIR);
}

function validateAddProjectType(type: ProjectType | undefined): void {
  const isValidType: boolean = !!Object.values(ProjectType).find(
    (projectType) => projectType === type,
  );
  if (!isValidType) {
    throw new Error(ErrorCode.PTIR);
  }
}

function validateAddProjectManagementType(
  type: ProjectManagementType | undefined,
): void {
  const isValidProjectManagementType: boolean = !!Object.values(
    ProjectManagementType,
  ).find((projectManagementType) => projectManagementType === type);
  if (!isValidProjectManagementType) {
    throw new Error(ErrorCode.PMTIR);
  }
}

function validateAddProjectUserInProjectType(
  type: UserInProjectType | undefined,
): void {
  const isValidUserInProjectType: boolean = !!Object.values(
    UserInProjectType,
  ).find((userInProjectType) => userInProjectType === type);
  if (!isValidUserInProjectType) {
    throw new Error(ErrorCode.PUIPTIR);
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
  if (key?.length > 10) throw new Error(ErrorCode.PKMBMTC);
  return true;
}

function validateEditProjectName(name: string | undefined): boolean {
  return !!name;
}

async function validateEditProjectLeader(
  leader: UserInProject | undefined,
): Promise<boolean> {
  if (!leader?.id) return false;
  const isLeaderExist: boolean = await userInProjectRepository.exist({
    where: { id: leader.id },
  });
  if (!isLeaderExist) throw new Error(ErrorCode.PNLME);
  return true;
}

async function validateIfProjectExistById(
  id: string | undefined,
): Promise<boolean> {
  try {
    return projectRepository.exist({ where: { id } });
  } catch (e) {
    throw new Error(ErrorCode.PPME);
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
  if (await validateEditProjectLeader(editProject.leader)) set.add("leader");
  if (!set.size) throw new Error(ErrorCode.PYMPMOVTC);
  return set;
}
