import * as express from "express";
import { UserInProjectController } from "../controller/user-in-project.controller";
import { AuthorizationMiddleware } from "../../middlewares/authorization.middleware";
import { UserInProjectType } from "../../types/user.types";

const router = express.Router();

router.post("/project/:projectId", UserInProjectController.addUserInProject);

router.get(
  "/project/:projectId",
  AuthorizationMiddleware(
    UserInProjectType.OBSERVER,
    UserInProjectType.MEMBER,
    UserInProjectType.ADMINISTRATOR,
  ),
  UserInProjectController.getUserPageByProjectId,
);

router.put(
  "/project/:projectId",
  AuthorizationMiddleware(
    UserInProjectType.MEMBER,
    UserInProjectType.ADMINISTRATOR,
  ),
  UserInProjectController.editCurrentUserDataByProjectId,
);

router.get(
  "/user/:userId/project/:projectId",
  AuthorizationMiddleware(
    UserInProjectType.OBSERVER,
    UserInProjectType.MEMBER,
    UserInProjectType.ADMINISTRATOR,
  ),
  UserInProjectController.getUserByUserIdAndProjectId,
);

router.patch(
  "/user/:userId/project/:projectId",
  AuthorizationMiddleware(UserInProjectType.ADMINISTRATOR),
  UserInProjectController.editMemberTypeByUserIdAndProjectId,
);

export { router as UserInProjectRoutes };
