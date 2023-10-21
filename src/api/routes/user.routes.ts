import * as express from "express";
import {Request, Response} from "express";
import {AppDataSource} from "../../data-source";
import {User} from "../entity/User";
import {Filters} from "../../global-types/pagination.types";
import {UserControllerFunctions} from "../controller/user.controller";


const userRepository = AppDataSource.getRepository(User)
const router = express.Router()

router.get('', async (req: Request, res, next) => {
    const filters = req.query as unknown as Filters<User>
    await UserControllerFunctions.getUserPage(filters, res)
})

router.get('/:id', async (req, res, next) => {
    const id = req.query['id'] as string
    await UserControllerFunctions.getCertainUser(id, res)
})

router.put('/:id', async (req: Request<User>, res: Response<User>): Promise<void> => {
    const user: User = req.body;
    const id: string = req.params['id'] as string
    await UserControllerFunctions.editCertainUser(id, user, res)
})

export default router
