import * as express from "express";
import { AuthController } from "../controller/auth.controller";

const router = express.Router();

router.post("/signup", AuthController.signup);

router.post("/login", AuthController.login);

router.post("/logout", AuthController.logout);

router.post("/verifyToken", AuthController.verifyUserToken);

export { router as AuthRoutes };
