import * as express from "express";
import { ProjectController } from "../controller/projects.controller";

const router = express.Router();
router.post("/", ProjectController.addProject);

router.put("/:id", ProjectController.editProject);

router.get("/:id", ProjectController.getProjectById);

export { router as ProjectRoutes };
