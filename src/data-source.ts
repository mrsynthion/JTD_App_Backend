import "reflect-metadata";
import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
  type: "mariadb",
  host: "localhost",
  port: 3306,
  username: "root",
  password: "pass",
  database: "JTD_App",
  synchronize: false,
  logging: false,
  entities: [
    "src/api/entity/*{.ts,.js}",
    "src/api/entity/dictionaries/*{.ts,.js}",
  ],
  migrations: ["src/migration/*{.ts,.js}"],
  subscribers: ["src/subscribe/*{.ts,.js}"],
});
