import {
  AddUserInProjectType,
  EditUserInProjectType,
  UserInProjectType,
} from "../../../global-types/dictionaries/Dict01_UserTypes.types";
import { Repository } from "typeorm";
import { AppDataSource } from "../../../data-source";
import { Dict01_UserInProjectTypes } from "../../entity/dictionaries/Dict01_UserInProjectTypes";
import { ErrorCode } from "../../../global-types/error.types";
import {
  Filters,
  Page,
  SortBy,
  SortDirection,
} from "../../../global-types/pagination.types";

const dict01_UserTypesRepository: Repository<Dict01_UserInProjectTypes> =
  AppDataSource.getRepository(Dict01_UserInProjectTypes);

async function addUserInProjectType(
  addUserInProjectType: AddUserInProjectType,
): Promise<UserInProjectType> {
  try {
    return await dict01_UserTypesRepository.save(addUserInProjectType);
  } catch ({ message }) {
    throw new Error(message);
  }
}

async function editUserInProjectType(
  editUserInProjectType: EditUserInProjectType,
  id: string,
): Promise<UserInProjectType> {
  try {
    const userInProjectTypeExist: boolean =
      await dict01_UserTypesRepository.exist({
        where: {
          id,
        },
      });
    if (!userInProjectTypeExist) throw new Error(ErrorCode.DVDNE);
    await dict01_UserTypesRepository.update(
      {
        id,
      },
      editUserInProjectType,
    );
    return await dict01_UserTypesRepository.findOneBy({ id });
  } catch ({ message }) {
    throw new Error(message);
  }
}

async function getUserInProjectTypeById(
  id: string,
): Promise<UserInProjectType> {
  try {
    const userInProjectType: UserInProjectType =
      await dict01_UserTypesRepository.findOneBy({
        id,
      });
    if (!(userInProjectType && userInProjectType.id))
      throw new Error(ErrorCode.DVDNE);

    return userInProjectType;
  } catch ({ message }) {
    throw new Error(message);
  }
}

async function getUserInProjectTypeByCode(
  code: number,
): Promise<UserInProjectType> {
  try {
    const userInProjectType: UserInProjectType =
      await dict01_UserTypesRepository.findOneBy({
        code,
      });
    if (!(userInProjectType && userInProjectType.id)) {
      throw new Error(ErrorCode.DVDNE);
    }

    return userInProjectType;
  } catch ({ message }) {
    throw new Error(message);
  }
}

async function getUserInProjectPage({
  page = 1,
  size = 100,
  sort,
  id,
  code,
  value,
}: Filters<UserInProjectType>): Promise<Page<UserInProjectType>> {
  try {
    return await AppDataSource.transaction(async (appDataSource) => {
      const totalElements = await appDataSource
        .getRepository(Dict01_UserInProjectTypes)
        .createQueryBuilder("dict01_UserInProjectTypes")
        .where(id ? "dict01_UserInProjectTypes.id like :id" : "1=1", {
          id: `%${id || ""}%`,
        })
        .andWhere(code ? "dict01_UserInProjectTypes.code like :code" : "1=1", {
          code: `%${code || ""}%`,
        })
        .andWhere(
          value ? "dict01_UserInProjectTypes.value like :value" : "1=1",
          {
            value: `%${value || ""}%`,
          },
        )
        .getCount();

      const skip: number = size * (page - 1) || 0;
      size = size === undefined || size === null ? totalElements : size;
      const sortBy: SortBy<UserInProjectType> = sort?.[0] ? sort[0] : "id";
      const sortDirection: SortDirection = sort?.[1] ? sort[1] : "ASC";

      const content = await appDataSource
        .getRepository(Dict01_UserInProjectTypes)
        .createQueryBuilder("dict01_UserInProjectTypes")
        .select([
          "dict01_UserInProjectTypes.id",
          "dict01_UserInProjectTypes.code",
          "dict01_UserInProjectTypes.value",
        ])
        .skip(skip)
        .take(size)

        .where(id ? "dict01_UserInProjectTypes.id like :id" : "1=1", {
          id: `%${id || ""}%`,
        })
        .andWhere(code ? "dict01_UserInProjectTypes.code like :code" : "1=1", {
          code: `%${code || ""}%`,
        })
        .andWhere(
          value ? "dict01_UserInProjectTypes.value like :value" : "1=1",
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
      } as Page<UserInProjectType>;
    });
  } catch ({ message }) {
    throw new Error(message);
  }
}

export const Dict01_UserInProjectTypesControllerFunctions = {
  addUserInProjectType,
  editUserInProjectType,
  getUserInProjectTypeById,
  getUserInProjectTypeByCode,
  getUserInProjectPage,
};
