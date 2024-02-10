import * as express from "express";
import { AppDataSource } from "../../data-source";
import { Task } from "../entity/Task";
import { TaskController } from "../controller/task.controller";
import { AuthorizationMiddleware } from "../../middlewares/authorization.middleware";
import { UserInProjectType } from "../../types/user.types";

const userRepository = AppDataSource.getRepository(Task);
const router = express.Router();

router.get(
  "/:id",
  AuthorizationMiddleware(
    UserInProjectType.OBSERVER,
    UserInProjectType.MEMBER,
    UserInProjectType.ADMINISTRATOR,
  ),
  TaskController.getCertainTask,
);

router.put(
  "/:id",
  AuthorizationMiddleware(
    UserInProjectType.MEMBER,
    UserInProjectType.ADMINISTRATOR,
  ),
  TaskController.editCertainTask,
);

router.patch(
  "/:id",
  AuthorizationMiddleware(
    UserInProjectType.MEMBER,
    UserInProjectType.ADMINISTRATOR,
  ),
  TaskController.changeTaskAssignedUser,
);

router.delete(
  "/:id",
  AuthorizationMiddleware(
    UserInProjectType.MEMBER,
    UserInProjectType.ADMINISTRATOR,
  ),
  TaskController.deleteCertainTask,
);

router.patch(
  "/:id/status/:status",

  AuthorizationMiddleware(
    UserInProjectType.MEMBER,
    UserInProjectType.ADMINISTRATOR,
  ),
  TaskController.changeTaskStatus,
);

router.post(
  "/project/:projectId",

  AuthorizationMiddleware(
    UserInProjectType.MEMBER,
    UserInProjectType.ADMINISTRATOR,
  ),
  TaskController.addTaskByProjectId,
);

router.get(
  "/project/:projectId",
  AuthorizationMiddleware(
    UserInProjectType.OBSERVER,
    UserInProjectType.MEMBER,
    UserInProjectType.ADMINISTRATOR,
  ),
  TaskController.getTaskPageByProjectId,
);

export { router as TaskRoutes };
