import {ErrorCode} from "../global-types/error.types";
import {Response} from "express";

function sendError(code: number, message: ErrorCode, res: Response) {
    res.statusCode = code;
    res.send(message)
}


export {sendError}