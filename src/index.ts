import * as express from "express";
import { Request, Response } from "express";
import * as bodyParser from "body-parser";
import { AppDataSource } from "./data-source";
import * as cookieParser from "cookie-parser";
import * as cors from "cors";
import { rootRoutes } from "./api/routes";
import * as dotenv from "dotenv";
import { unknownErrorHandler } from "./middlewares/error.middleware";

dotenv.config();
const { PORT } = process.env;

AppDataSource.initialize()
  .then(async () => {
    // await AppDataSource.synchronize(true);

    // create express app
    const app = express();
    app.use(bodyParser.json());
    app.use(cookieParser());
    app.use(
      cors({
        origin: "http://localhost:3000",
        credentials: true,
      }),
    );
    app.use(unknownErrorHandler);
    // register express routes from defined application routes
    app.use("", rootRoutes);
    app.get("*", (req: Request, res: Response) => {
      res.status(505).json({ message: "Bad Request" });
    });

    // start express server
    app.listen(PORT);

    // insert new users for test

    console.log(`Express server has started on port ${PORT}.`);
  })
  .catch((error) => console.log(error));
