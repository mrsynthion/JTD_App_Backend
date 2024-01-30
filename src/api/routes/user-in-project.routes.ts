import * as express from "express";
import { UserInProjectController } from "../controller/user-in-project.controller";

const router = express.Router();

router.get("/:id", UserInProjectController.getUserPageByProjectId);
router.post("/", UserInProjectController.addUserInProject);

export { router as UserInProjectRoutes };
