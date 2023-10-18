import * as express from "express";
import {Request} from "express";
import {AppDataSource} from "../data-source";
import {User} from "../entity/User";


const userRepository = AppDataSource.getRepository(User)
const router = express.Router()

router.get('', async (req, res, next) => {
    try {
        const data = await AppDataSource.transaction(async (appDataSource) => {
                const users = await appDataSource
                    .getRepository(User)
                    .createQueryBuilder("user")
                    .skip(1)
                    .take(2)
                    .getMany()

                const totalElements = await appDataSource
                    .getRepository(User)
                    .createQueryBuilder("user")
                    .getCount()

                return {
                    users,
                    totalElements
                }
            }
        )
        res.statusCode = 200;
        res.json(data);
    } catch (e) {
        res.statusCode = 500;
        res.send(`Error ${e}`);
    }

})

router.get('/:id', async (req, res, next) => {
    try {
        const id = req.params['id']
        const user: User = await userRepository.findOne({
            where: {
                id
            }
        })
        res.statusCode = 200;
        res.json(user);
    } catch (e) {
        res.statusCode = 500;
        res.send(`Error ${e}`);
    }

})

router.post('', async (req: Request<User>, res, next) => {
    try {
        const user: User = req.body;
        const savedUser: User = await userRepository.save(user);
        res.statusCode = 200;
        console.log(savedUser)
        res.json(savedUser);
    } catch (e) {
        res.statusCode = 500;
        res.send(`Error ${e}`);
    }
})

export default router
