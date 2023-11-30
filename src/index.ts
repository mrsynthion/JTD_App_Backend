import * as express from "express"
import * as bodyParser from "body-parser"
import {AppDataSource} from "./data-source"
import {Routes} from "./api/routes";
import {serveFiles, setup} from "swagger-ui-express";
import {load} from 'js-yaml';
import {readFileSync} from "fs";
import * as cookieParser from 'cookie-parser';
import * as cors from 'cors'

const PORT: number = 4500;

AppDataSource.initialize().then(async () => {
    // create express app
    const app = express()
    app.use(bodyParser.json())
    app.use(cookieParser())
    app.use(cors({
                origin: 'http://localhost:3000',
                credentials: true
            }
        )
    )

    const spec = readFileSync('./src/swagger.json', {encoding: 'utf8', flag: 'r'});
    const swaggerDocument = load(spec);

    const options = {
        swaggerOptions: {
            url: "/api-docs/swagger.json",
        },
    }

    app.get('/', (req, res) => {
        res.redirect('/api-docs')
    })
    app.get("/api-docs/swagger.json", (req, res) => res.json(swaggerDocument));
    app.use('/api-docs', serveFiles(null, options), setup(null, options));

    // register express routes from defined application routes
    Routes(app);

    // setup express app here
    // ...

    // start express server
    app.listen(PORT)

    // insert new users for test

    console.log(`Express server has started on port ${PORT}.`)

}).catch(error => console.log(error))
