import { Express } from "express";
import UserRoutes from "./user.routes";
import AuthRoutes from "./auth.routes";
import TaskRoutes from "./task.routes";
import UserTypesRoutes from "./dictionaries";

export const Routes = (app: Express) => {
  app.use("/user", UserRoutes);
  app.use("/auth", AuthRoutes);
  app.use("/task", TaskRoutes);
  app.use("/user-types", UserTypesRoutes);
};
