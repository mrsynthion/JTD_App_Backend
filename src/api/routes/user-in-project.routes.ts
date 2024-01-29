import * as express from "express";
import { UserInProjectController } from "../controller/user-in-project.controller";

const router = express.Router();

router.get("/:id", UserInProjectController.getUserPage);

export { router as UserInProjectRoutes };
