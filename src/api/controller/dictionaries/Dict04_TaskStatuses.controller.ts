import { Repository } from "typeorm";
import { AppDataSource } from "../../../data-source";
import { Dict04_TaskStatuses } from "../../entity/dictionaries/Dict04_TaskStatuses";
import {
  AddTaskStatus,
  EditTaskStatus,
  TaskStatus,
} from "../../../global-types/dictionaries/Dict04_TaskStatuses.types";
import { ErrorCode } from "../../../global-types/error.types";
import {
  Filters,
  Page,
  SortBy,
  SortDirection,
} from "../../../global-types/pagination.types";

const dict04_TaskStatusesRepository: Repository<Dict04_TaskStatuses> =
  AppDataSource.getRepository(Dict04_TaskStatuses);

async function addTaskStatus(
  addTaskStatus: AddTaskStatus,
): Promise<TaskStatus> {
  try {
    return await dict04_TaskStatusesRepository.save(addTaskStatus);
  } catch ({ message }) {
    throw new Error(message);
  }
}

async function editTaskStatus(
  editTaskType: EditTaskStatus,
  id: string,
): Promise<TaskStatus> {
  try {
    const taskStatusExist: boolean = await dict04_TaskStatusesRepository.exist({
      where: {
        id,
      },
    });
    if (!taskStatusExist) throw new Error(ErrorCode.DVDNE);
    await dict04_TaskStatusesRepository.update(
      {
        id,
      },
      editTaskType,
    );
    return await dict04_TaskStatusesRepository.findOneBy({ id });
  } catch ({ message }) {
    throw new Error(message);
  }
}

async function getTaskStatusById(id: string): Promise<TaskStatus> {
  try {
    const taskStatus: TaskStatus =
      await dict04_TaskStatusesRepository.findOneBy({
        id,
      });
    if (!(taskStatus && taskStatus.id)) throw new Error(ErrorCode.DVDNE);

    return taskStatus;
  } catch ({ message }) {
    throw new Error(message);
  }
}

async function getTaskStatusByCode(code: number): Promise<TaskStatus> {
  try {
    const taskStatus: TaskStatus =
      await dict04_TaskStatusesRepository.findOneBy({
        code,
      });
    if (!(taskStatus && taskStatus.id)) {
      throw new Error(ErrorCode.DVDNE);
    }

    return taskStatus;
  } catch ({ message }) {
    throw new Error(message);
  }
}

async function getTaskStatusPage({
  page = 1,
  size = 100,
  sort,
  id,
  code,
  value,
}: Filters<TaskStatus>): Promise<Page<TaskStatus>> {
  try {
    return await AppDataSource.transaction(async (appDataSource) => {
      const totalElements = await appDataSource
        .getRepository(Dict04_TaskStatuses)
        .createQueryBuilder("dict04_TaskStatuses")
        .where(id ? "dict04_TaskStatuses.id like :id" : "1=1", {
          id: `%${id || ""}%`,
        })
        .andWhere(code ? "dict04_TaskStatuses.code like :code" : "1=1", {
          code: `%${code || ""}%`,
        })
        .andWhere(value ? "dict04_TaskStatuses.value like :value" : "1=1", {
          value: `%${value || ""}%`,
        })
        .getCount();

      const skip: number = size * (page - 1) || 0;
      size = size === undefined || size === null ? totalElements : size;
      const sortBy: SortBy<TaskStatus> = sort?.[0] ? sort[0] : "code";
      const sortDirection: SortDirection = sort?.[1] ? sort[1] : "ASC";

      const content = await appDataSource
        .getRepository(Dict04_TaskStatuses)
        .createQueryBuilder("dict04_TaskStatuses")
        .select([
          "dict04_TaskStatuses.id",
          "dict04_TaskStatuses.code",
          "dict04_TaskStatuses.value",
        ])
        .skip(skip)
        .take(size)

        .where(id ? "dict04_TaskStatuses.id like :id" : "1=1", {
          id: `%${id || ""}%`,
        })
        .andWhere(code ? "dict04_TaskStatuses.code like :code" : "1=1", {
          code: `%${code || ""}%`,
        })
        .andWhere(value ? "dict04_TaskStatuses.value like :value" : "1=1", {
          value: `%${value || ""}%`,
        })
        .addOrderBy(sortBy, sortDirection)
        .getMany();

      return {
        content,
        totalElements,
        totalPages: Math.floor(totalElements / size || 0) || 1,
        numberOfElements: content.length,
      } as Page<TaskStatus>;
    });
  } catch ({ message }) {
    throw new Error(message);
  }
}

export const Dict04_TaskStatusControllerFunctions = {
  addTaskStatus,
  editTaskStatus,
  getTaskStatusById,
  getTaskStatusByCode,
  getTaskStatusPage,
};
