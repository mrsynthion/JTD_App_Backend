import * as express from "express";
import { AppDataSource } from "../../data-source";
import { Task } from "../entity/Task";
import { TaskController } from "../controller/task.controller";

const userRepository = AppDataSource.getRepository(Task);
const router = express.Router();

router.get("/:id", TaskController.getCertainTask);

router.post("/project/:projectId", TaskController.addTaskByProjectId);

router.get("/project/:projectId", TaskController.getTaskPageByProjectId);

// router.put(
//   "/:id",
//   async (req: Request<Task>, res: Response<Task>): Promise<void> => {
//     const task: Task = req.body;
//     const { id } = req.params;
//     await TaskControllerFunctions.editCertainTask(id, task, res);
//   },
// );

export { router as TaskRoutes };
