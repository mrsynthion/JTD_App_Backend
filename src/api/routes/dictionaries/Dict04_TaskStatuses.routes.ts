import * as express from "express";
import { Request } from "express";
import {
  AddTaskStatus,
  EditTaskStatus,
  TaskStatus,
} from "../../../global-types/dictionaries/Dict04_TaskStatuses.types";
import { ErrorCode } from "../../../global-types/error.types";
import { sendError } from "../../../utils/error.utils";
import { Dict04_TaskStatusControllerFunctions } from "../../controller/dictionaries/Dict04_TaskStatuses.controller";
import { Filters, Page } from "../../../global-types/pagination.types";

const router = express.Router();
router.post(
  "/",
  async (req: Request<unknown, TaskStatus, AddTaskStatus>, res, next) => {
    try {
      const addTaskStatus: AddTaskStatus = req.body;
      const projectType =
        await Dict04_TaskStatusControllerFunctions.addTaskStatus(addTaskStatus);
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
  async (
    req: Request<{ id: string }, TaskStatus, EditTaskStatus>,
    res,
    next,
  ) => {
    try {
      const editTaskStatus: EditTaskStatus = req.body;
      const id: string = req.params["id"] as string;

      const taskStatus =
        await Dict04_TaskStatusControllerFunctions.editTaskStatus(
          editTaskStatus,
          id,
        );
      res.statusCode = 200;
      res.json(taskStatus);
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
    req: Request<unknown, Page<TaskStatus>, unknown, Filters<TaskStatus>>,
    res,
    next,
  ) => {
    try {
      const filters: Filters<TaskStatus> = req.query;
      const taskStatusPage =
        await Dict04_TaskStatusControllerFunctions.getTaskStatusPage(filters);
      res.statusCode = 200;
      res.json(taskStatusPage);
    } catch ({ message }) {
      sendError(400, message, res);
    }
  },
);

router.get(
  "/:id",
  async (req: Request<{ id: string }, TaskStatus>, res, next) => {
    try {
      const id: string = req.params["id"];
      const taskStatus =
        await Dict04_TaskStatusControllerFunctions.getTaskStatusById(id);
      res.statusCode = 200;
      res.json(taskStatus);
    } catch ({ message }) {
      sendError(400, message, res);
    }
  },
);

router.get(
  "/code/:code",
  async (req: Request<{ code: number }, TaskStatus>, res, next) => {
    try {
      const code: number = req.params["code"];
      const taskStatus =
        await Dict04_TaskStatusControllerFunctions.getTaskStatusByCode(code);
      res.statusCode = 200;
      res.json(taskStatus);
    } catch ({ message }) {
      sendError(400, message, res);
    }
  },
);

export default router;
