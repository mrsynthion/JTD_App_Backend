import * as express from "express";
import { readFileSync } from "fs";
import { load } from "js-yaml";
import { serveFiles, setup } from "swagger-ui-express";

const swaggerRouter = express.Router();

const doc = {
  info: {
    title: "My API",
    description: "Description",
  },
  host: "localhost:4500",
};

const spec = readFileSync("./src/swagger.json", {
  encoding: "utf8",
  flag: "r",
});
const swaggerDocument = load(spec);

const options = {
  swaggerOptions: {
    url: "/api-docs/swagger.json",
  },
};
swaggerRouter.get("/swagger.json", (req, res) => res.json(swaggerDocument));
swaggerRouter.use(
  "",
  serveFiles(undefined, options),
  setup(undefined, options),
);

export { swaggerRouter as swaggerRoutes };
