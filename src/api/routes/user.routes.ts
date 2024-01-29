import * as express from "express";
import { UserController } from "../controller/user.controller";

const router = express.Router();

router.get("/:id", UserController.getCertainUser);

router.put("/:id", UserController.editCertainUser);

export { router as UserRoutes };
