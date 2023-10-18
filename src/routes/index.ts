import {Express} from "express";
import UserRoutes from "./user-routes";


export const Routes = (app: Express) => {
    app.use('/users', UserRoutes)
}