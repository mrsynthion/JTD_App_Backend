import { AddProjectDto } from "../global-types/projects.types";
import { ErrorCode } from "../global-types/error.types";
import { Repository } from "typeorm";
import { Dict02_ProjectTypes } from "../api/entity/dictionaries/Dict02_ProjectTypes";
import { AppDataSource } from "../data-source";
import { Dict05_ProjectManagementTypes } from "../api/entity/dictionaries/Dict05_ProjectManagementTypes";
import { ProjectTypeDto } from "../global-types/dictionaries/Dict02_ProjectTypes.types";
import { ProjectManagementTypeDto } from "../global-types/dictionaries/Dict05_ProjectManagementTypes.types";
import { Dict01_UserInProjectTypes } from "../api/entity/dictionaries/Dict01_UserInProjectTypes";
import { UserInProjectTypeDto } from "../global-types/dictionaries/Dict01_UserTypes.types";

const dict01_UserInProjectTypes: Repository<Dict01_UserInProjectTypes> =
  AppDataSource.getRepository(Dict01_UserInProjectTypes);

const dict02_ProjectTypesRepository: Repository<Dict02_ProjectTypes> =
  AppDataSource.getRepository(Dict02_ProjectTypes);

const dict05_ProjectManagementTypesRepository: Repository<Dict05_ProjectManagementTypes> =
  AppDataSource.getRepository(Dict05_ProjectManagementTypes);

function validateProjectKey(key: string): void {
  if (!key) throw new Error(ErrorCode.PKIR);
  if (key?.length > 10) throw new Error(ErrorCode.PKMBMTC);
}

function validateProjectName(name: string): void {
  if (!name) throw new Error(ErrorCode.PNIR);
}

async function validateProjectType(type: ProjectTypeDto): Promise<void> {
  if (!type?.id) throw new Error(ErrorCode.PTIR);
  const isTypeExist: boolean = await dict02_ProjectTypesRepository.exist({
    where: { id: type.id },
  });
  if (!isTypeExist) throw new Error(ErrorCode.PTME);
}

async function validateProjectManagementType(
  managementType: ProjectManagementTypeDto,
): Promise<void> {
  if (!managementType?.id) throw new Error(ErrorCode.PMTIR);
  const isManagementTypeExist: boolean =
    await dict05_ProjectManagementTypesRepository.exist({
      where: { id: managementType.id },
    });
  if (!isManagementTypeExist) throw new Error(ErrorCode.PMTME);
}

async function validateProjectUserInProjectType(
  userInProjectType: UserInProjectTypeDto,
): Promise<void> {
  if (!userInProjectType?.id) throw new Error(ErrorCode.PUIPTIR);
  const isManagementTypeExist: boolean = await dict01_UserInProjectTypes.exist({
    where: { id: userInProjectType.id },
  });
  if (!isManagementTypeExist) throw new Error(ErrorCode.PUIPTME);
}

export async function validateAddProjectData(
  addProject: AddProjectDto,
): Promise<void> {
  validateProjectKey(addProject.key);
  validateProjectName(addProject.name);
  await validateProjectType(addProject.type);
  await validateProjectManagementType(addProject.projectManagementType);
  await validateProjectUserInProjectType(addProject.userInProjectType);
}
