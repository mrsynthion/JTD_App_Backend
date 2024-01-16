import * as express from "express";
import { Request } from "express";
import {
  LoginDto,
  logoutMessage,
  RegisterDto,
  TokenName,
} from "../../global-types/auth.types";
import { AuthControllerFunctions } from "../controller/auth.controller";
import { sendError } from "../../utils/error.utils";
import { ErrorCode } from "../../global-types/error.types";

const router = express.Router();
router.post("/signup", async (req: Request<RegisterDto>, res, next) => {
  try {
    let registerUserData: RegisterDto = req.body;
    const newUser = await AuthControllerFunctions.signup(registerUserData);
    res.statusCode = 201;
    res.json(newUser);
  } catch ({ message }) {
    let newMessage: ErrorCode = message;
    if (message.toLowerCase().includes("duplicate"))
      newMessage = ErrorCode.TEIAIU;

    sendError(400, newMessage, res);
  }
});

router.post("/login", async (req: Request<LoginDto>, res, next) => {
  try {
    const { email, password } = req.body;
    const [user, token] = await AuthControllerFunctions.login(email, password);
    res.statusCode = 200;
    res.cookie(TokenName, token, { httpOnly: true });
    res.json(user);
  } catch ({ message }) {
    let newMessage: ErrorCode = message;
    if (message.includes("uq1")) newMessage = ErrorCode.TEIAIU;
    sendError(400, newMessage, res);
  }
});

router.post("/logout", async (req, res, next) => {
  try {
    res.clearCookie(TokenName);
    res.statusCode = 200;
    res.send(logoutMessage);
  } catch ({ message }) {
    sendError(400, message, res);
  }
});

router.post("/verifyToken", async (req, res, next) => {
  const token: string = req.cookies["token"];
  const isValidToken: boolean =
    !!token && AuthControllerFunctions.verifyUserToken(token);
  res.json({ isValidToken });
});

export default router;
