import * as express from "express";
import { Request } from "express";
import {
  AddProjectManagementTypeDto,
  EditProjectManagementTypeDto,
  ProjectManagementTypeDto,
} from "../../../global-types/dictionaries/Dict05_ProjectManagementTypes.types";
import { Dict05_ProjectManagementTypeControllerFunctions } from "../../controller/dictionaries/Dict05_ProjectManagementTypes.controller";
import { ErrorCode } from "../../../global-types/error.types";
import { sendError } from "../../../utils/error.utils";
import { Filters, Page } from "../../../global-types/pagination.types";

const router = express.Router();
router.post(
  "/",
  async (
    req: Request<
      unknown,
      ProjectManagementTypeDto,
      AddProjectManagementTypeDto
    >,
    res,
    next,
  ) => {
    try {
      const addProjectManagementType: AddProjectManagementTypeDto = req.body;
      const projectManagementType =
        await Dict05_ProjectManagementTypeControllerFunctions.addProjectManagementType(
          addProjectManagementType,
        );
      res.statusCode = 201;
      res.json(projectManagementType);
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
    req: Request<
      { id: string },
      ProjectManagementTypeDto,
      EditProjectManagementTypeDto
    >,
    res,
    next,
  ) => {
    try {
      const editProjectManagementType: EditProjectManagementTypeDto = req.body;
      const id: string = req.params["id"] as string;

      const projectManagementType =
        await Dict05_ProjectManagementTypeControllerFunctions.editProjectManagementType(
          editProjectManagementType,
          id,
        );
      res.statusCode = 200;
      res.json(projectManagementType);
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
      Page<ProjectManagementTypeDto>,
      unknown,
      Filters<ProjectManagementTypeDto>
    >,
    res,
    next,
  ) => {
    try {
      const filters: Filters<ProjectManagementTypeDto> = req.query;
      const projectManagementTypePage =
        await Dict05_ProjectManagementTypeControllerFunctions.getProjectManagementTypePage(
          filters,
        );
      res.statusCode = 200;
      res.json(projectManagementTypePage);
    } catch ({ message }) {
      sendError(400, message, res);
    }
  },
);

router.get(
  "/:id",
  async (req: Request<{ id: string }, ProjectManagementTypeDto>, res, next) => {
    try {
      const id: string = req.params["id"];
      const projectManagementType =
        await Dict05_ProjectManagementTypeControllerFunctions.getProjectManagementTypeById(
          id,
        );
      res.statusCode = 200;
      res.json(projectManagementType);
    } catch ({ message }) {
      sendError(400, message, res);
    }
  },
);

router.get(
  "/code/:code",
  async (
    req: Request<{ code: number }, ProjectManagementTypeDto>,
    res,
    next,
  ) => {
    try {
      const code: number = req.params["code"];
      const projectManagementType =
        await Dict05_ProjectManagementTypeControllerFunctions.getProjectManagementTypeByCode(
          code,
        );
      res.statusCode = 200;
      res.json(projectManagementType);
    } catch ({ message }) {
      sendError(400, message, res);
    }
  },
);

export default router;
