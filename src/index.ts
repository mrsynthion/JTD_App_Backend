import * as express from "express";
import { Request, Response } from "express";
import * as bodyParser from "body-parser";
import { AppDataSource } from "./data-source";
import * as cookieParser from "cookie-parser";
import * as cors from "cors";
import { rootRoutes } from "./api/routes";
import * as dotenv from "dotenv";
import { UnknownErrorMiddleware } from "./middlewares/error.middleware";
import { HttpCode } from "./types/http.types";
import { ErrorCode } from "./types/error.types";
import { ServerErrorDto } from "./dto/error.dto";
import { LoggerMiddleware } from "./middlewares/logger.middleware";

dotenv.config();
const { PORT } = process.env;

const App = async () => {
  // create express app
  const app = express();
  // middlewares
  app.use(bodyParser.json());
  app.use(cookieParser());
  app.use(
    cors({
      origin: "http://localhost:3000",
      credentials: true,
    }),
  );
  try {
    await AppDataSource.initialize();
    // await AppDataSource.synchronize(true);

    //Logger
    app.use(LoggerMiddleware);
    // unknown error handling
    app.use(UnknownErrorMiddleware);

    // register express routes from defined application routes
    app.use("", rootRoutes);
    // Not found path error
    app.get("*", (req: Request, res: Response<ServerErrorDto>) => {
      res.status(HttpCode.NOT_FOUND).json({ message: ErrorCode.SERVER_PNF });
    });

    console.log(`Express server has started on port ${PORT}.`);
  } catch (e) {
    app.get("*", (req: Request, res: Response<ServerErrorDto>) => {
      res
        .status(HttpCode.INTERNAL_SERVER_ERROR)
        .json({ message: ErrorCode.SERVER_ISE });
    });
  }

  app.listen(PORT);
};

App();
