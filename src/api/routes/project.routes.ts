import * as express from "express";
import { ProjectController } from "../controller/projects.controller";
import { AuthorizationMiddleware } from "../../middlewares/authorization.middleware";
import { UserInProjectType } from "../../types/user.types";

const router = express.Router();

router.post("/", ProjectController.addProject);

router.get("/", ProjectController.getCurrentUserProjectsList);

router.put(
  "/:id",
  AuthorizationMiddleware(UserInProjectType.ADMINISTRATOR),
  ProjectController.editProject,
);

router.patch(
  "/:id",
  AuthorizationMiddleware(UserInProjectType.ADMINISTRATOR),
  ProjectController.editProjectLeaderById,
);

router.get(
  "/:id",
  AuthorizationMiddleware(
    UserInProjectType.ADMINISTRATOR,
    UserInProjectType.MEMBER,
    UserInProjectType.OBSERVER,
  ),
  ProjectController.getProjectById,
);

export { router as ProjectRoutes };
