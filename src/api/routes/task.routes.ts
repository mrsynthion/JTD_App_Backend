import * as express from "express";
import {Request, Response} from "express";
import {AppDataSource} from "../../data-source";
import {Task} from "../entity/Task";
import {TaskControllerFunctions} from "../controller/task.controller";


const userRepository = AppDataSource.getRepository(Task)
const router = express.Router()

// router.get('', async (req: Request, res, next) => {
//     const filters = req.query as unknown as Filters<Task>
//     await UserControllerFunctions.getUserPage(filters, res)
// })

router.get('/:id', async (req, res, next) => {
    const id = req.query['id'] as string
    await TaskControllerFunctions.getCertainTask(id, res)
})

router.post('', async (req: Request<Task>, res: Response<Task>): Promise<void> => {
    const task: Task = req.body;
    await TaskControllerFunctions.addTask(task, res)
})

router.put('/:id', async (req: Request<Task>, res: Response<Task>): Promise<void> => {
    const task: Task = req.body;
    const id: string = req.params['id'] as string
    await TaskControllerFunctions.editCertainTask(id, task, res)
})

export default router
