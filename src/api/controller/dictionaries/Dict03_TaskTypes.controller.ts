import { Repository } from "typeorm";
import { AppDataSource } from "../../../data-source";
import { ErrorCode } from "../../../global-types/error.types";
import {
  Filters,
  Page,
  SortBy,
  SortDirection,
} from "../../../global-types/pagination.types";
import { Dict03_TaskTypes } from "../../entity/dictionaries/Dict03_TaskTypes";
import {
  AddTaskType,
  EditTaskType,
  TaskType,
} from "../../../global-types/dictionaries/Dict03_TaskTypes.types";

const dict03_TaskTypesRepository: Repository<Dict03_TaskTypes> =
  AppDataSource.getRepository(Dict03_TaskTypes);

async function addTaskType(addTaskType: AddTaskType): Promise<TaskType> {
  try {
    return await dict03_TaskTypesRepository.save(addTaskType);
  } catch ({ message }) {
    throw new Error(message);
  }
}

async function editTaskType(
  editTaskType: EditTaskType,
  id: string,
): Promise<TaskType> {
  try {
    const taskTypeExist: boolean = await dict03_TaskTypesRepository.exist({
      where: {
        id,
      },
    });
    if (!taskTypeExist) throw new Error(ErrorCode.DVDNE);
    await dict03_TaskTypesRepository.update(
      {
        id,
      },
      editTaskType,
    );
    return await dict03_TaskTypesRepository.findOneBy({ id });
  } catch ({ message }) {
    throw new Error(message);
  }
}

async function getTaskTypeById(id: string): Promise<TaskType> {
  try {
    const taskType: TaskType = await dict03_TaskTypesRepository.findOneBy({
      id,
    });
    if (!(taskType && taskType.id)) throw new Error(ErrorCode.DVDNE);

    return taskType;
  } catch ({ message }) {
    throw new Error(message);
  }
}

async function getTaskTypeByCode(code: number): Promise<TaskType> {
  try {
    const taskType: TaskType = await dict03_TaskTypesRepository.findOneBy({
      code,
    });
    if (!(taskType && taskType.id)) {
      throw new Error(ErrorCode.DVDNE);
    }

    return taskType;
  } catch ({ message }) {
    throw new Error(message);
  }
}

async function getTaskTypePage({
  page = 1,
  size = 100,
  sort,
  id,
  code,
  value,
}: Filters<TaskType>): Promise<Page<TaskType>> {
  try {
    return await AppDataSource.transaction(async (appDataSource) => {
      const totalElements = await appDataSource
        .getRepository(Dict03_TaskTypes)
        .createQueryBuilder("dict03_TaskType")
        .where(id ? "dict03_TaskType.id like :id" : "1=1", {
          id: `%${id || ""}%`,
        })
        .andWhere(code ? "dict03_TaskType.code like :code" : "1=1", {
          code: `%${code || ""}%`,
        })
        .andWhere(value ? "dict03_TaskType.value like :value" : "1=1", {
          value: `%${value || ""}%`,
        })
        .getCount();

      const skip: number = size * (page - 1) || 0;
      size = size === undefined || size === null ? totalElements : size;
      const sortBy: SortBy<TaskType> = sort?.[0] ? sort[0] : "code";
      const sortDirection: SortDirection = sort?.[1] ? sort[1] : "ASC";

      const content = await appDataSource
        .getRepository(Dict03_TaskTypes)
        .createQueryBuilder("dict03_TaskType")
        .select([
          "dict03_TaskType.id",
          "dict03_TaskType.code",
          "dict03_TaskType.value",
        ])
        .skip(skip)
        .take(size)

        .where(id ? "dict03_TaskType.id like :id" : "1=1", {
          id: `%${id || ""}%`,
        })
        .andWhere(code ? "dict03_TaskType.code like :code" : "1=1", {
          code: `%${code || ""}%`,
        })
        .andWhere(value ? "dict03_TaskType.value like :value" : "1=1", {
          value: `%${value || ""}%`,
        })
        .addOrderBy(sortBy, sortDirection)
        .getMany();

      return {
        content,
        totalElements,
        totalPages: Math.floor(totalElements / size || 0) || 1,
        numberOfElements: content.length,
      } as Page<TaskType>;
    });
  } catch ({ message }) {
    throw new Error(message);
  }
}

export const Dict03_TaskTypesControllerFunctions = {
  addTaskType,
  editTaskType,
  getTaskTypeById,
  getTaskTypeByCode,
  getTaskTypePage,
};
