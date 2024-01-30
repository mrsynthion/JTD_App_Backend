import * as express from "express";
import { Request, Response } from "express";
import { AppDataSource } from "../../data-source";
import {
  getDataFromTokenByKey,
  getTokenFromRequest,
} from "../../utils/token-managements.utils";
import { Task } from "../entity/Task";
import { Filters } from "../../types/pagination.types";
import { TaskControllerFunctions } from "../controller/task.controller";
import { ErrorCode } from "../../types/error.types";

const userRepository = AppDataSource.getRepository(Task);
const router = express.Router();

router.get("", async (req: Request, res, next) => {
    const token: string = getTokenFromRequest(req);
    try {
      const userId: string = getDataFromTokenByKey(token, "id");
      const filters = req.query as unknown as Filters<Task>;
      await TaskControllerFunctions.getTaskPage(userId, filters, res);
    } catch ({ message }) {
      throw new Error(message as ErrorCode);
    }
});

router.post(
  "",
  async (req: Request<Task>, res: Response<Task>): Promise<void> => {
    const token: string = getTokenFromRequest(req);
    try {
      const userId: string = getDataFromTokenByKey(token, "id");
      const task: Task = req.body;
      await TaskControllerFunctions.addTask(userId, task, res);
    } catch ({ message }) {
      throw new Error(message as ErrorCode);
    }
  },
);

router.get("/:id", async (req, res, next) => {
  const id = req.params["id"] as string;
  await TaskControllerFunctions.getCertainTask(id, res);
});

router.put(
  "/:id",
  async (req: Request<Task>, res: Response<Task>): Promise<void> => {
    const task: Task = req.body;
    const id: string = req.params["id"] as string;
    await TaskControllerFunctions.editCertainTask(id, task, res);
  },
);

export { router as TaskRoutes };
