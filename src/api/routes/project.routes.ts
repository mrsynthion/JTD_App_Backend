import * as express from "express";
import { ProjectController } from "../controller/projects.controller";

const router = express.Router();

router.post("/", ProjectController.addProject);

router.get("/", ProjectController.getCurrentUserProjectsList);

router.put("/:id", ProjectController.editProject);

router.patch("/:id", ProjectController.editProjectLeaderById);

router.get("/:id", ProjectController.getProjectById);

export { router as ProjectRoutes };
