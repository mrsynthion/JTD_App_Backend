import * as express from "express";
import { ProjectRoutes } from "./project.routes";
import { UserRoutes } from "./user.routes";
import { AuthRoutes } from "./auth.routes";
import { TaskRoutes } from "./task.routes";
import { swaggerRoutes } from "./swagger.routes";
import { authenticate } from "../../middlewares/auth.middleware";
import { errorHandler } from "../../middlewares/error.middleware";
import { UserInProjectRoutes } from "./user-in-project.routes";
import { WorkLogRoutes } from "./work-log.routes";

const router = express.Router();

router.use("/auth", AuthRoutes, errorHandler);
router.use("/user", authenticate, UserRoutes, errorHandler);
router.use("/user-in-project", authenticate, UserInProjectRoutes, errorHandler);
router.use("/task", authenticate, TaskRoutes, errorHandler);
router.use("/project", authenticate, ProjectRoutes, errorHandler);
router.use("/work-log", authenticate, WorkLogRoutes, errorHandler);
router.use("/api-docs", swaggerRoutes, errorHandler);
router.use("*", errorHandler);

export { router as rootRoutes };
