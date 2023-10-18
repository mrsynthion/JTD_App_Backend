import "reflect-metadata"
import {DataSource} from "typeorm"
import {User} from "./entity/User"

export const AppDataSource = new DataSource({
    type: "mariadb",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "pass",
    database: "to-do-next",
    synchronize: true,
    logging: false,
    entities: [User],
    migrations: [],
    subscribers: [],
})
