import * as express from "express";
import { UserInProjectController } from "../controller/user-in-project.controller";

const router = express.Router();

router.post("/project/:projectId", UserInProjectController.addUserInProject);

router.get(
  "/project/:projectId",
  UserInProjectController.getUserPageByProjectId,
);

router.put(
  "/project/:projectId",
  UserInProjectController.editCurrentUserDataByProjectId,
);

router.get(
  "/user/:userId/project/:projectId",
  UserInProjectController.getUserByUserIdAndProjectId,
);

router.patch(
  "/user/:userId/project/:projectId",
  UserInProjectController.editMemberTypeByUserIdAndProjectId,
);

export { router as UserInProjectRoutes };
