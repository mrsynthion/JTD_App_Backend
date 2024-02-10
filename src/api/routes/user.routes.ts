import * as express from "express";
import { UserController } from "../controller/user.controller";

const router = express.Router();

router.get("/", UserController.getCurrentUserData);

router.put("/", UserController.editCurrentUser);

export { router as UserRoutes };
