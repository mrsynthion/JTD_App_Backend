import * as express from "express";
import { WorkLogController } from "../controller/work-log.controller";
import { AuthorizationMiddleware } from "../../middlewares/authorization.middleware";
import { UserInProjectType } from "../../types/user.types";

const router = express.Router();

router.post(
  "/task/:taskId",

  AuthorizationMiddleware(
    UserInProjectType.MEMBER,
    UserInProjectType.ADMINISTRATOR,
  ),
  WorkLogController.addWorkLogByTaskId,
);

router.get(
  "/task/:taskId",
  AuthorizationMiddleware(
    UserInProjectType.OBSERVER,
    UserInProjectType.MEMBER,
    UserInProjectType.ADMINISTRATOR,
  ),
  WorkLogController.getWorkLogListByTaskId,
);

router.put(
  "/:id",
  AuthorizationMiddleware(
    UserInProjectType.MEMBER,
    UserInProjectType.ADMINISTRATOR,
  ),
  WorkLogController.editWorkLog,
);

router.delete(
  "/:id",
  AuthorizationMiddleware(
    UserInProjectType.MEMBER,
    UserInProjectType.ADMINISTRATOR,
  ),
  WorkLogController.deleteWorkLog,
);

export { router as WorkLogRoutes };
