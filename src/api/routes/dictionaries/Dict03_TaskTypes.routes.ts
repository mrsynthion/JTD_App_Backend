import * as express from "express";
import { Request } from "express";
import {
  AddTaskType,
  EditTaskType,
  TaskType,
} from "../../../global-types/dictionaries/Dict03_TaskTypes.types";
import { sendError } from "../../../utils/error.utils";
import { ErrorCode } from "../../../global-types/error.types";
import { Dict03_TaskTypesControllerFunctions } from "../../controller/dictionaries/Dict03_TaskTypes.controller";
import { Filters, Page } from "../../../global-types/pagination.types";

const router = express.Router();
router.post(
  "/",
  async (req: Request<unknown, TaskType, AddTaskType>, res, next) => {
    try {
      const addTaskType: AddTaskType = req.body;
      const projectType =
        await Dict03_TaskTypesControllerFunctions.addTaskType(addTaskType);
      res.statusCode = 201;
      res.json(projectType);
    } catch ({ message }) {
      let newMessage: ErrorCode = message;
      if (message.toLowerCase().includes("duplicate"))
        newMessage = ErrorCode.DVCNBD;

      sendError(400, newMessage, res);
    }
  },
);

router.put(
  "/:id",
  async (req: Request<{ id: string }, TaskType, EditTaskType>, res, next) => {
    try {
      const editTaskType: EditTaskType = req.body;
      const id: string = req.params["id"] as string;

      const projectType =
        await Dict03_TaskTypesControllerFunctions.editTaskType(
          editTaskType,
          id,
        );
      res.statusCode = 200;
      res.json(projectType);
    } catch ({ message }) {
      let newMessage: ErrorCode = message;
      if (message.toLowerCase().includes("duplicate"))
        newMessage = ErrorCode.DVCNBD;

      sendError(400, newMessage, res);
    }
  },
);

router.get(
  "/",
  async (
    req: Request<unknown, Page<TaskType>, unknown, Filters<TaskType>>,
    res,
    next,
  ) => {
    try {
      const filters: Filters<TaskType> = req.query;
      const taskTypePage =
        await Dict03_TaskTypesControllerFunctions.getTaskTypePage(filters);
      res.statusCode = 200;
      res.json(taskTypePage);
    } catch ({ message }) {
      sendError(400, message, res);
    }
  },
);

router.get(
  "/:id",
  async (req: Request<{ id: string }, TaskType>, res, next) => {
    try {
      const id: string = req.params["id"];
      const taskType =
        await Dict03_TaskTypesControllerFunctions.getTaskTypeById(id);
      res.statusCode = 200;
      res.json(taskType);
    } catch ({ message }) {
      sendError(400, message, res);
    }
  },
);

router.get(
  "/code/:code",
  async (req: Request<{ code: number }, TaskType>, res, next) => {
    try {
      const code: number = req.params["code"];
      const taskType =
        await Dict03_TaskTypesControllerFunctions.getTaskTypeByCode(code);
      res.statusCode = 200;
      res.json(taskType);
    } catch ({ message }) {
      sendError(400, message, res);
    }
  },
);

export default router;
