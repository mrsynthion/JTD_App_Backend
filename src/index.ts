import * as express from "express"
import * as bodyParser from "body-parser"
import {AppDataSource} from "./data-source"
import {Routes} from "./routes";

AppDataSource.initialize().then(async () => {

    // create express app
    const app = express()
    app.use(bodyParser.json())

    // register express routes from defined application routes
    Routes(app);

    // setup express app here
    // ...

    // start express server
    app.listen(4500)

    // insert new users for test

    console.log("Express server has started on port 4500.")

}).catch(error => console.log(error))
