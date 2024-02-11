import * as express from "express";
import { ProjectRoutes } from "./project.routes";
import { UserRoutes } from "./user.routes";
import { AuthRoutes } from "./auth.routes";
import { TaskRoutes } from "./task.routes";
import { swaggerRoutes } from "./swagger.routes";
import { AuthenticationMiddleware } from "../../middlewares/authentication.middleware";
import { ErrorMiddleware } from "../../middlewares/error.middleware";
import { UserInProjectRoutes } from "./user-in-project.routes";
import { WorkLogRoutes } from "./work-log.routes";

const router = express.Router();

router.use("/auth", AuthRoutes, ErrorMiddleware);
router.use("/user", AuthenticationMiddleware, UserRoutes, ErrorMiddleware);
router.use(
  "/user-in-project",
  AuthenticationMiddleware,
  UserInProjectRoutes,
  ErrorMiddleware,
);
router.use("/task", AuthenticationMiddleware, TaskRoutes, ErrorMiddleware);
router.use(
  "/project",
  AuthenticationMiddleware,
  ProjectRoutes,
  ErrorMiddleware,
);
router.use(
  "/work-log",
  AuthenticationMiddleware,
  WorkLogRoutes,
  ErrorMiddleware,
);
router.use("/api-docs", swaggerRoutes, ErrorMiddleware);
router.use("*", ErrorMiddleware);

export { router as rootRoutes };
