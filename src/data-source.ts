import "reflect-metadata"
import {DataSource} from "typeorm"
import {User} from "./api/entity/User"
import {User1697618152174} from "./migration";

export const AppDataSource = new DataSource({
    type: "mariadb",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "pass",
    database: "to-do-next",
    synchronize: false,
    logging: false,
    entities: [User],
    migrations: [User1697618152174],
    subscribers: [],
})
