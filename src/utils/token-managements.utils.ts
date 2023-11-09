import {decode, sign, SignOptions, verify} from 'jsonwebtoken'
import {ErrorCode} from "../global-types/error.types";
import {User} from "../api/entity/User";
import {config} from 'dotenv'

export interface TokenPayload {
    id: string,
    email: string
}

const options: SignOptions = {
    mutatePayload: false,
    expiresIn: '30m',

}

function generateToken({id, email}: User): string {
    const privateKey: string = config().parsed['PRIVATE_KEY'];
    if (!privateKey) {
        throw new Error(ErrorCode.TNPK)
    }
    return sign(
        {id, email} as TokenPayload,
        privateKey,
        options);
}

function verifyToken(token: string) {
    verify(token, config().parsed['PRIVATE_KEY'], (error, decoded) => {
        if (error) {
            console.log(error)
            throw new Error(ErrorCode.TTE)
        }
    })

}

function getDataFromToken(token: string, key?: keyof TokenPayload) {
    return key ? decode(token) : decode(token)[key]
}


export {generateToken, verifyToken, getDataFromToken}