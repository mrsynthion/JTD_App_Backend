import * as express from "express";
import { AppDataSource } from "../../data-source";
import { Task } from "../entity/Task";
import { TaskController } from "../controller/task.controller";

const userRepository = AppDataSource.getRepository(Task);
const router = express.Router();

router.get("/:id", TaskController.getCertainTask);

router.put("/:id", TaskController.editCertainTask);

router.patch("/:id", TaskController.changeTaskAssignedUser);

router.delete("/:id", TaskController.deleteCertainTask);

router.patch("/:id/status/:status", TaskController.changeTaskStatus);

router.post("/project/:projectId", TaskController.addTaskByProjectId);

router.get("/project/:projectId", TaskController.getTaskPageByProjectId);

export { router as TaskRoutes };
