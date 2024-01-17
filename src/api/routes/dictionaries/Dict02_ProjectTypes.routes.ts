import * as express from "express";
import { Request } from "express";
import {
  AddProjectType,
  EditProjectType,
  ProjectType,
} from "../../../global-types/dictionaries/Dict02_ProjectTypes.types";
import { ErrorCode } from "../../../global-types/error.types";
import { sendError } from "../../../utils/error.utils";
import { Dict02_ProjectTypesControllerFunctions } from "../../controller/dictionaries/Dict02_ProjectTypes.controller";
import { Filters, Page } from "../../../global-types/pagination.types";

const router = express.Router();
router.post(
  "/",
  async (req: Request<unknown, ProjectType, AddProjectType>, res, next) => {
    try {
      const addProjectType: AddProjectType = req.body;
      const projectType =
        await Dict02_ProjectTypesControllerFunctions.addProjectType(
          addProjectType,
        );
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
    req: Request<{ id: string }, ProjectType, EditProjectType>,
    res,
    next,
  ) => {
    try {
      const editProjectType: EditProjectType = req.body;
      const id: string = req.params["id"] as string;

      const projectType =
        await Dict02_ProjectTypesControllerFunctions.editProjectType(
          editProjectType,
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
    req: Request<unknown, Page<ProjectType>, unknown, Filters<ProjectType>>,
    res,
    next,
  ) => {
    try {
      const filters: Filters<ProjectType> = req.query;
      const projectTypePage =
        await Dict02_ProjectTypesControllerFunctions.getProjectTypePage(
          filters,
        );
      res.statusCode = 200;
      res.json(projectTypePage);
    } catch ({ message }) {
      sendError(400, message, res);
    }
  },
);

router.get(
  "/:id",
  async (req: Request<{ id: string }, ProjectType>, res, next) => {
    try {
      const id: string = req.params["id"];
      const projectType =
        await Dict02_ProjectTypesControllerFunctions.getProjectTypeById(id);
      res.statusCode = 200;
      res.json(projectType);
    } catch ({ message }) {
      sendError(400, message, res);
    }
  },
);

router.get(
  "/code/:code",
  async (req: Request<{ code: number }, ProjectType>, res, next) => {
    try {
      const code: number = req.params["code"];
      const projectType =
        await Dict02_ProjectTypesControllerFunctions.getProjectTypeByCode(code);
      res.statusCode = 200;
      res.json(projectType);
    } catch ({ message }) {
      sendError(400, message, res);
    }
  },
);

export default router;
