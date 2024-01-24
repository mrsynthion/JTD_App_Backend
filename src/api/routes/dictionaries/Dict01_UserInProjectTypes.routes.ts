import * as express from "express";
import { Request } from "express";
import {
  AddUserInProjectTypeDto,
  EditUserInProjectTypeDto,
  UserInProjectTypeDto,
} from "../../../global-types/dictionaries/Dict01_UserTypes.types";
import { Dict01_UserInProjectTypesControllerFunctions } from "../../controller/dictionaries/Dict01_UserInProjectTypes.controller";
import { ErrorCode } from "../../../global-types/error.types";
import { sendError } from "../../../utils/error.utils";
import { Filters, Page } from "../../../global-types/pagination.types";

const router = express.Router();

router.post(
  "/",
  async (
    req: Request<unknown, UserInProjectTypeDto, AddUserInProjectTypeDto>,
    res,
    next,
  ) => {
    try {
      const addUserInProjectType: AddUserInProjectTypeDto = req.body;
      const userInProjectType =
        await Dict01_UserInProjectTypesControllerFunctions.addUserInProjectType(
          addUserInProjectType,
        );
      res.statusCode = 201;
      res.json(userInProjectType);
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
      UserInProjectTypeDto,
      EditUserInProjectTypeDto
    >,
    res,
    next,
  ) => {
    try {
      const editUserInProjectType: EditUserInProjectTypeDto = req.body;
      const id: string = req.params["id"] as string;

      const userInProjectType =
        await Dict01_UserInProjectTypesControllerFunctions.editUserInProjectType(
          editUserInProjectType,
          id,
        );
      res.statusCode = 200;
      res.json(userInProjectType);
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
      Page<UserInProjectTypeDto>,
      unknown,
      Filters<UserInProjectTypeDto>
    >,
    res,
    next,
  ) => {
    try {
      const filters: Filters<UserInProjectTypeDto> = req.query;
      const userInProjectTypeList =
        await Dict01_UserInProjectTypesControllerFunctions.getUserInProjectPage(
          filters,
        );
      res.statusCode = 200;
      res.json(userInProjectTypeList);
    } catch ({ message }) {
      sendError(400, message, res);
    }
  },
);

router.get(
  "/:id",
  async (req: Request<{ id: string }, UserInProjectTypeDto>, res, next) => {
    try {
      const id: string = req.params["id"];
      const userInProjectType =
        await Dict01_UserInProjectTypesControllerFunctions.getUserInProjectTypeById(
          id,
        );
      res.statusCode = 200;
      res.json(userInProjectType);
    } catch ({ message }) {
      sendError(400, message, res);
    }
  },
);

router.get(
  "/code/:code",
  async (req: Request<{ code: number }, UserInProjectTypeDto>, res, next) => {
    try {
      const code: number = req.params["code"];
      const userInProjectType =
        await Dict01_UserInProjectTypesControllerFunctions.getUserInProjectTypeByCode(
          code,
        );
      res.statusCode = 200;
      res.json(userInProjectType);
    } catch ({ message }) {
      sendError(400, message, res);
    }
  },
);

export default router;
