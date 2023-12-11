import * as express from "express";
import {Request} from "express";
import {User} from "../entity/User";
import {LoginDto} from "../../global-types/auth.types";
import {AuthControllerFunctions} from "../controller/auth.controller";


const router = express.Router()
router.post('/signup', async (req: Request<User>, res, next) => {
    let user: User = req.body;
    await AuthControllerFunctions.signup(user, res);

});

router.post('/login', async (req: Request<LoginDto>, res, next) => {
    const {username, password} = req.body;
    await AuthControllerFunctions.login(username, password, res);
});

router.post('/logout', async (req, res, next) => {
    await AuthControllerFunctions.logout(res)
})

router.post('/verifyToken', async (req, res, next) => {
    const token: string = req.cookies['token'];
    await AuthControllerFunctions.verifyUserToken(token, res);
})

export default router;