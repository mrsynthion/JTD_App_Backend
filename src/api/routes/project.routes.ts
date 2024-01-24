import * as express from "express";
import { Request } from "express";
import { ErrorCode } from "../../global-types/error.types";
import { sendError } from "../../utils/error.utils";
import { AddProjectDto, ProjectDto } from "../../global-types/projects.types";
import { UserDto } from "../../global-types/user.types";
import { getDataFromTokenByKey } from "../../utils/token-managements.utils";
import { TokenName } from "../../global-types/auth.types";
import { ProjectsControllerFunctions } from "../controller/projects.controller";

const router = express.Router();
router.post("/", async (req: Request<AddProjectDto>, res, next) => {
  try {
    let addProject: AddProjectDto = req.body;
    const token = req.cookies[TokenName];
    const currentUser: UserDto = getDataFromTokenByKey(token, "user");
    const newProject = await ProjectsControllerFunctions.addProject(
      addProject,
      currentUser,
    );
    res.statusCode = 201;
    res.json(newProject);
  } catch ({ message }) {
    let newMessage: ErrorCode = message;
    if (message.toLowerCase().includes("duplicate"))
      newMessage = ErrorCode.SUTEIAIU;

    sendError(400, newMessage, res);
  }
});

router.get(
  "/:id",
  async (req: Request<unknown, ProjectDto, unknown, string>, res, next) => {
    try {
      const id: string = req.query["id"];
      const project: ProjectDto =
        await ProjectsControllerFunctions.getProjectById(id);
      res.statusCode = 200;
      res.json(project);
    } catch ({ message }) {
      let newMessage: ErrorCode = message;
      if (message.toLowerCase().includes("duplicate"))
        newMessage = ErrorCode.SUTEIAIU;

      sendError(400, newMessage, res);
    }
  },
);

export default router;
