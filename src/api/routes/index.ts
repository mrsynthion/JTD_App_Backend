import { Express } from "express";
import UserRoutes from "./user.routes";
import AuthRoutes from "./auth.routes";
import TaskRoutes from "./task.routes";
import UserInProjectTypeRoutes from "./dictionaries/Dict01_UserInProjectTypes.routes";
import ProjectTypeRoutes from "./dictionaries/Dict02_ProjectTypes.routes";
import TaskTypesRoutes from "./dictionaries/Dict03_TaskTypes.routes";
import TaskStatusesRoutes from "./dictionaries/Dict04_TaskStatuses.routes";
import ProjectManagementTypesRoutes from "./dictionaries/Dict05_ProjectManagementTypes.routes";

export const Routes = (app: Express) => {
  app.use("/user", UserRoutes);
  app.use("/auth", AuthRoutes);
  app.use("/task", TaskRoutes);
  app.use("/user-in-project-type", UserInProjectTypeRoutes);
  app.use("/project-type", ProjectTypeRoutes);
  app.use("/task-type", TaskTypesRoutes);
  app.use("/task-status", TaskStatusesRoutes);
  app.use("/project-management-type", ProjectManagementTypesRoutes);
};
