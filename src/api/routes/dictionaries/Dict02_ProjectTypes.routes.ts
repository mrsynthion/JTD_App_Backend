import * as express from "express";
import { Request } from "express";
import {
  AddProjectTypeDto,
  EditProjectTypeDto,
  ProjectTypeDto,
} from "../../../global-types/dictionaries/Dict02_ProjectTypes.types";
import { ErrorCode } from "../../../global-types/error.types";
import { sendError } from "../../../utils/error.utils";
import { Dict02_ProjectTypesControllerFunctions } from "../../controller/dictionaries/Dict02_ProjectTypes.controller";
import { Filters, Page } from "../../../global-types/pagination.types";

const router = express.Router();
router.post(
  "/",
  async (
    req: Request<unknown, ProjectTypeDto, AddProjectTypeDto>,
    res,
    next,
  ) => {
    try {
      const addProjectType: AddProjectTypeDto = req.body;
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
    req: Request<{ id: string }, ProjectTypeDto, EditProjectTypeDto>,
    res,
    next,
  ) => {
    try {
      const editProjectType: EditProjectTypeDto = req.body;
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
    req: Request<
      unknown,
      Page<ProjectTypeDto>,
      unknown,
      Filters<ProjectTypeDto>
    >,
    res,
    next,
  ) => {
    try {
      const filters: Filters<ProjectTypeDto> = req.query;
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
  async (req: Request<{ id: string }, ProjectTypeDto>, res, next) => {
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
  async (req: Request<{ code: number }, ProjectTypeDto>, res, next) => {
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
