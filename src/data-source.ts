import "reflect-metadata";
import * as dotenv from "dotenv";
import { DataSource } from "typeorm";

dotenv.config();
const { DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_DATABASE, NODE_ENV } =
  process.env as { [key: string]: string };
export const AppDataSource = new DataSource({
  type: "mariadb",
  host: DB_HOST,
  port: parseInt(DB_PORT),
  username: DB_USERNAME,
  password: DB_PASSWORD,
  database: DB_DATABASE,
  synchronize: false,
  logging: false,
  entities: [
    "src/api/entity/*{.ts,.js}",
    "src/api/entity/dictionaries/*{.ts,.js}",
  ],
  migrations: ["src/migration/*{.ts,.js}"],
  subscribers: ["src/subscribe/*{.ts,.js}"],
});
