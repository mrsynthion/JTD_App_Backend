import * as express from "express";
import {Request, Response} from "express";
import {AppDataSource} from "../../data-source";
import {Task} from "../entity/Task";
import {TaskControllerFunctions} from "../controller/task.controller";
import {Filters} from "../../global-types/pagination.types";
import {getDataFromToken, verifyToken} from "../../utils/token-managements.utils";
import {sendError} from "../../utils/error.utils";
import {stringToBool} from "../../utils/request.utils";


const userRepository = AppDataSource.getRepository(Task)
const router = express.Router()

router.get('', async (req: Request, res, next) => {
    const token: string = req.cookies['token']
    try {
        verifyToken(token)
        const userId: string = getDataFromToken(token)['userId']
        const filters = req.query as unknown as Filters<Task>
        await TaskControllerFunctions.getTaskPage(userId, filters, res)
    } catch ({message}) {
        sendError(400, message, res)
    }
})

router.get('/:id', async (req, res, next) => {
    const id = req.params['id'] as string
    await TaskControllerFunctions.getCertainTask(id, res)
})

router.post('', async (req: Request<Task>, res: Response<Task>): Promise<void> => {
    const token: string = req.cookies['token']
    try {
        verifyToken(token)
        const userId: string = getDataFromToken(token)['userId']
        const task: Task = req.body;
        await TaskControllerFunctions.addTask(userId, task, res)
    } catch ({message}) {
        sendError(400, message, res)
    }

})

router.patch('/:id/:completed', async (req: Request<Task>, res: Response<Task>): Promise<void> => {
    const token: string = req.cookies['token']
    try {
        verifyToken(token)
        const userId: string = getDataFromToken(token)['userId']
        const id: string = req.params['id'] as string;
        const completed: boolean = stringToBool(req.params['completed'].toString());

        await TaskControllerFunctions.editCertainTaskCompleted(id, completed, userId, res)
    } catch ({message}) {
        sendError(400, message, res)
    }

})

router.put('/:id', async (req: Request<Task>, res: Response<Task>): Promise<void> => {
    const task: Task = req.body;
    const id: string = req.params['id'] as string
    await TaskControllerFunctions.editCertainTask(id, task, res)
})

export default router
