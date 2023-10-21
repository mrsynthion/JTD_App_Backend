import {Express} from "express";
import UserRoutes from "./user.routes";
import AuthRoutes from './auth.routes'


export const Routes = (app: Express) => {
    app.use('/users', UserRoutes);
    app.use('/auth', AuthRoutes)
}