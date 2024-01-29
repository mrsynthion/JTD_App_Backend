import { NextFunction, Request, Response } from "express";
import { Filters, Page, SortDirection } from "../../types/pagination.types";
import { AppDataSource } from "../../data-source";
import { User } from "../entity/User";
import { UserInProjectMinimumDto } from "../../dto/user.dto";

export class UserInProjectController {
  static async getUserPage(
    req: Request<
      { id: string },
      Page<UserInProjectMinimumDto>,
      unknown,
      Filters<UserInProjectMinimumDto>
    >,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const id: string = req.params["id"];
      let {
        id: userId,
        firstName,
        lastName,
        email,
        size,
        page,
        sort,
      } = req.query;
      const data = await AppDataSource.transaction(async (appDataSource) => {
        const query = appDataSource
          .getRepository(User)
          .createQueryBuilder("user")
          .leftJoin("user.projects", "uip")
          .leftJoin("uip.project", "project")
          .select([
            "user.id",
            "user.firstName",
            "user.lastName",
            "user.email",
            "uip.name",
            "uip.isLeader",
            "uip.type",
          ])
          .where("project.id = :id", { id })
          .andWhere("user.id like :userId", { userId: `%${userId || ""}%` })
          .andWhere("user.email like :email", { email: `%${email || ""}%` })
          .andWhere("user.firstName like :firstName", {
            firstName: `%${firstName || ""}%`,
          })
          .andWhere("user.lastName like :lastName", {
            lastName: `%${lastName || ""}%`,
          })
          .cache(true);

        const totalElements = await query.getCount();

        const skip: number = size * (page - 1) || 0;
        size = size === undefined || size === null ? totalElements : size;
        const sortBy = sort?.[0] ? sort[0] : "user.id";
        const sortDirection: SortDirection = sort?.[1] ? sort[1] : "ASC";

        const users: User[] = await query
          .skip(skip)
          .take(size)
          .addOrderBy(sortBy, sortDirection)
          .getMany();

        const content: UserInProjectMinimumDto[] = users.map(
          (user) =>
            ({
              id: user.id,
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email,
              name: user.projects![0].name,
              isLeader: user.projects![0].isLeader,
              memberType: user.projects![0].type,
            }) as UserInProjectMinimumDto,
        );

        return {
          content,
          totalElements,
          totalPages: Math.floor(totalElements / size || 0),
          numberOfElements: content.length,
        } as Page<UserInProjectMinimumDto>;
      });
      res.status(200).json(data);
    } catch ({ message }) {
      next(message);
    }
  }
}
