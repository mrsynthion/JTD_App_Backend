import { Repository } from "typeorm";
import { AppDataSource } from "../../../data-source";
import { ErrorCode } from "../../../global-types/error.types";
import {
  Filters,
  Page,
  SortBy,
  SortDirection,
} from "../../../global-types/pagination.types";
import { Dict02_ProjectTypes } from "../../entity/dictionaries/Dict02_ProjectTypes";
import {
  AddProjectTypeDto,
  EditProjectTypeDto,
  ProjectTypeDto,
} from "../../../global-types/dictionaries/Dict02_ProjectTypes.types";

const dict02_ProjectTypesRepository: Repository<Dict02_ProjectTypes> =
  AppDataSource.getRepository(Dict02_ProjectTypes);

async function addProjectType(
  addProjectType: AddProjectTypeDto,
): Promise<ProjectTypeDto> {
  try {
    return await dict02_ProjectTypesRepository.save(addProjectType);
  } catch ({ message }) {
    throw new Error(message);
  }
}

async function editProjectType(
  editProjectType: EditProjectTypeDto,
  id: string,
): Promise<ProjectTypeDto> {
  try {
    const projectTypeExist: boolean = await dict02_ProjectTypesRepository.exist(
      {
        where: {
          id,
        },
      },
    );
    if (!projectTypeExist) throw new Error(ErrorCode.DVDNE);
    await dict02_ProjectTypesRepository.update(
      {
        id,
      },
      editProjectType,
    );
    return await dict02_ProjectTypesRepository.findOneBy({ id });
  } catch ({ message }) {
    throw new Error(message);
  }
}

async function getProjectTypeById(id: string): Promise<ProjectTypeDto> {
  try {
    const projectType: ProjectTypeDto =
      await dict02_ProjectTypesRepository.findOneBy({
        id,
      });
    if (!(projectType && projectType.id)) throw new Error(ErrorCode.DVDNE);

    return projectType;
  } catch ({ message }) {
    throw new Error(message);
  }
}

async function getProjectTypeByCode(code: number): Promise<ProjectTypeDto> {
  try {
    const projectType: ProjectTypeDto =
      await dict02_ProjectTypesRepository.findOneBy({
        code,
      });
    if (!(projectType && projectType.id)) {
      throw new Error(ErrorCode.DVDNE);
    }

    return projectType;
  } catch ({ message }) {
    throw new Error(message);
  }
}

async function getProjectTypePage({
  page = 1,
  size = 100,
  sort,
  id,
  code,
  value,
}: Filters<ProjectTypeDto>): Promise<Page<ProjectTypeDto>> {
  try {
    return await AppDataSource.transaction(async (appDataSource) => {
      const totalElements = await appDataSource
        .getRepository(Dict02_ProjectTypes)
        .createQueryBuilder("dict02_ProjectTypes")
        .where(id ? "dict02_ProjectTypes.id like :id" : "1=1", {
          id: `%${id || ""}%`,
        })
        .andWhere(code ? "dict02_ProjectTypes.code like :code" : "1=1", {
          code: `%${code || ""}%`,
        })
        .andWhere(value ? "dict02_ProjectTypes.value like :value" : "1=1", {
          value: `%${value || ""}%`,
        })
        .getCount();

      const skip: number = size * (page - 1) || 0;
      size = size === undefined || size === null ? totalElements : size;
      const sortBy: SortBy<ProjectTypeDto> = sort?.[0] ? sort[0] : "code";
      const sortDirection: SortDirection = sort?.[1] ? sort[1] : "ASC";

      const content = await appDataSource
        .getRepository(Dict02_ProjectTypes)
        .createQueryBuilder("dict02_ProjectTypes")
        .select([
          "dict02_ProjectTypes.id",
          "dict02_ProjectTypes.code",
          "dict02_ProjectTypes.value",
        ])
        .skip(skip)
        .take(size)

        .where(id ? "dict02_ProjectTypes.id like :id" : "1=1", {
          id: `%${id || ""}%`,
        })
        .andWhere(code ? "dict02_ProjectTypes.code like :code" : "1=1", {
          code: `%${code || ""}%`,
        })
        .andWhere(value ? "dict02_ProjectTypes.value like :value" : "1=1", {
          value: `%${value || ""}%`,
        })
        .addOrderBy(sortBy, sortDirection)
        .getMany();

      return {
        content,
        totalElements,
        totalPages: Math.floor(totalElements / size || 0) || 1,
        numberOfElements: content.length,
      } as Page<ProjectTypeDto>;
    });
  } catch ({ message }) {
    throw new Error(message);
  }
}

export const Dict02_ProjectTypesControllerFunctions = {
  addProjectType,
  editProjectType,
  getProjectTypeById,
  getProjectTypeByCode,
  getProjectTypePage,
};
