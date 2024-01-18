import { Repository } from "typeorm";
import { AppDataSource } from "../../../data-source";
import { Dict05_ProjectManagementTypes } from "../../entity/dictionaries/Dict05_ProjectManagementTypes";
import {
  AddProjectManagementType,
  EditProjectManagementType,
  ProjectManagementType,
} from "../../../global-types/dictionaries/Dict05_ProjectManagementTypes.types";
import { ErrorCode } from "../../../global-types/error.types";
import {
  Filters,
  Page,
  SortBy,
  SortDirection,
} from "../../../global-types/pagination.types";

const dict05_ProjectManagementTypesRepository: Repository<Dict05_ProjectManagementTypes> =
  AppDataSource.getRepository(Dict05_ProjectManagementTypes);

async function addProjectManagementType(
  addProjectManagementType: AddProjectManagementType,
): Promise<ProjectManagementType> {
  try {
    return await dict05_ProjectManagementTypesRepository.save(
      addProjectManagementType,
    );
  } catch ({ message }) {
    throw new Error(message);
  }
}

async function editProjectManagementType(
  editProjectManagementType: EditProjectManagementType,
  id: string,
): Promise<ProjectManagementType> {
  try {
    const projectManagementTypeExist: boolean =
      await dict05_ProjectManagementTypesRepository.exist({
        where: {
          id,
        },
      });
    if (!projectManagementTypeExist) throw new Error(ErrorCode.DVDNE);
    await dict05_ProjectManagementTypesRepository.update(
      {
        id,
      },
      editProjectManagementType,
    );
    return await dict05_ProjectManagementTypesRepository.findOneBy({ id });
  } catch ({ message }) {
    throw new Error(message);
  }
}

async function getProjectManagementTypeById(
  id: string,
): Promise<ProjectManagementType> {
  try {
    const projectManagementType: ProjectManagementType =
      await dict05_ProjectManagementTypesRepository.findOneBy({
        id,
      });
    if (!(projectManagementType && projectManagementType.id))
      throw new Error(ErrorCode.DVDNE);

    return projectManagementType;
  } catch ({ message }) {
    throw new Error(message);
  }
}

async function getProjectManagementTypeByCode(
  code: number,
): Promise<ProjectManagementType> {
  try {
    const projectManagementType: ProjectManagementType =
      await dict05_ProjectManagementTypesRepository.findOneBy({
        code,
      });
    if (!(projectManagementType && projectManagementType.id)) {
      throw new Error(ErrorCode.DVDNE);
    }

    return projectManagementType;
  } catch ({ message }) {
    throw new Error(message);
  }
}

async function getProjectManagementTypePage({
  page = 1,
  size = 100,
  sort,
  id,
  code,
  value,
}: Filters<ProjectManagementType>): Promise<Page<ProjectManagementType>> {
  try {
    return await AppDataSource.transaction(async (appDataSource) => {
      const totalElements = await appDataSource
        .getRepository(Dict05_ProjectManagementTypes)
        .createQueryBuilder("dict05_ProjectManagementTypes")
        .where(id ? "dict05_ProjectManagementTypes.id like :id" : "1=1", {
          id: `%${id || ""}%`,
        })
        .andWhere(
          code ? "dict05_ProjectManagementTypes.code like :code" : "1=1",
          {
            code: `%${code || ""}%`,
          },
        )
        .andWhere(
          value ? "dict05_ProjectManagementTypes.value like :value" : "1=1",
          {
            value: `%${value || ""}%`,
          },
        )
        .getCount();

      const skip: number = size * (page - 1) || 0;
      size = size === undefined || size === null ? totalElements : size;
      const sortBy: SortBy<ProjectManagementType> = sort?.[0]
        ? sort[0]
        : "code";
      const sortDirection: SortDirection = sort?.[1] ? sort[1] : "ASC";

      const content = await appDataSource
        .getRepository(Dict05_ProjectManagementTypes)
        .createQueryBuilder("dict05_ProjectManagementTypes")
        .select([
          "dict05_ProjectManagementTypes.id",
          "dict05_ProjectManagementTypes.code",
          "dict05_ProjectManagementTypes.value",
        ])
        .skip(skip)
        .take(size)

        .where(id ? "dict05_ProjectManagementTypes.id like :id" : "1=1", {
          id: `%${id || ""}%`,
        })
        .andWhere(
          code ? "dict05_ProjectManagementTypes.code like :code" : "1=1",
          {
            code: `%${code || ""}%`,
          },
        )
        .andWhere(
          value ? "dict05_ProjectManagementTypes.value like :value" : "1=1",
          {
            value: `%${value || ""}%`,
          },
        )
        .addOrderBy(sortBy, sortDirection)
        .getMany();

      return {
        content,
        totalElements,
        totalPages: Math.floor(totalElements / size || 0) || 1,
        numberOfElements: content.length,
      } as Page<ProjectManagementType>;
    });
  } catch ({ message }) {
    throw new Error(message);
  }
}

export const Dict05_ProjectManagementTypeControllerFunctions = {
  addProjectManagementType,
  editProjectManagementType,
  getProjectManagementTypeById,
  getProjectManagementTypeByCode,
  getProjectManagementTypePage,
};
