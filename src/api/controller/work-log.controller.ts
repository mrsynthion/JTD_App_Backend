import { NextFunction, Request, Response } from "express";
import {
  AddWorkLogDto,
  EditWorkLogDto,
  WorkLogDto,
} from "../../dto/work-log.dto";
import { Repository } from "typeorm";
import { WorkLog } from "../entity/WorkLog";
import { AppDataSource } from "../../data-source";
import { Task } from "../entity/Task";
import { AddWorkLogType } from "../../types/work-log.types";
import { HttpCode, successMessage } from "../../types/http.types";

export class WorkLogController {
  static async addWorkLogByTaskId(
    req: Request<{ taskId: string }, unknown, AddWorkLogDto>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const { taskId } = req.params;
    const addWorkLogDto = req.body;
    try {
      const workLogRepository: Repository<WorkLog> =
        AppDataSource.getRepository(WorkLog);
      const workLog: AddWorkLogType = {
        ...addWorkLogDto,
        task: {
          id: taskId,
        } as Task,
      };
      await workLogRepository.save(workLog);
      res.status(HttpCode.CREATED).json(successMessage);
    } catch ({ message }) {
      next(message);
    }
  }

  static async getWorkLogListByTaskId(
    req: Request<{ taskId: string }, WorkLogDto[]>,
    res: Response<WorkLogDto[]>,
    next: NextFunction,
  ): Promise<void> {
    const { taskId } = req.params;
    try {
      const workLogRepository: Repository<WorkLogDto> =
        AppDataSource.getRepository(WorkLog);
      const workLogList = await workLogRepository
        .createQueryBuilder("workLog")
        .select([
          "workLog.id",
          "workLog.description",
          "workLog.startDate",
          "workLog.endDate",
        ])
        .where("workLog.taskId = :taskId", { taskId })
        .getMany();
      res.status(HttpCode.SUCCESS).json(workLogList);
    } catch ({ message }) {
      next(message);
    }
  }

  static async editWorkLog(
    req: Request<{ id: string }, unknown, EditWorkLogDto>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const { id } = req.params;
    const editWorkLogDto = req.body;
    try {
      const workLogRepository: Repository<WorkLog> =
        AppDataSource.getRepository(WorkLog);
      await workLogRepository.update({ id }, editWorkLogDto);
      res.status(HttpCode.SUCCESS).json(successMessage);
    } catch ({ message }) {
      next(message);
    }
  }

  static async deleteWorkLog(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const { id } = req.params;
    try {
      const workLogRepository: Repository<WorkLog> =
        AppDataSource.getRepository(WorkLog);
      await workLogRepository.delete({ id });
      res.status(HttpCode.SUCCESS).json(successMessage);
    } catch ({ message }) {
      next(message);
    }
  }
}
