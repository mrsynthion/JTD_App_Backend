import "reflect-metadata"
import {DataSource} from "typeorm"

export const AppDataSource = new DataSource({
    type: "mariadb",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "pass",
    database: "to-do-next",
    synchronize: false,
    logging: false,
    entities: ['src/api/entity/*{.ts,.js}'],
    migrations: ['src/migration/*{.ts,.js}'],
    subscribers: ['src/subscribe/*{.ts,.js}'],
})
