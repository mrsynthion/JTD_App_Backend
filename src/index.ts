import * as express from "express"
import * as bodyParser from "body-parser"
import {AppDataSource} from "./data-source"
import {Routes} from "./api/routes";
import {serve, setup} from "swagger-ui-express";
import {load} from 'js-yaml';
import {readFileSync} from "fs";


AppDataSource.initialize().then(async () => {

    // create express app
    const app = express()
    app.use(bodyParser.json())

    const spec = readFileSync('./src/swagger.yaml', {encoding: 'utf8', flag: 'r'});
    const swaggerDocument = load(spec);

    app.use('/api-docs', serve, setup(swaggerDocument));

    // register express routes from defined application routes
    Routes(app);

    // setup express app here
    // ...

    // start express server
    app.listen(4500)

    // insert new users for test

    console.log("Express server has started on port 4500.")

}).catch(error => console.log(error))
