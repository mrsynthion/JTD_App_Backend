import {decode, sign, SignOptions, verify} from 'jsonwebtoken'
import {ErrorCode} from "../global-types/error.types";
import {User} from "../api/entity/User";
import {config} from 'dotenv'

const options: SignOptions = {
    mutatePayload: false,
    expiresIn: '30m',

}

function generateToken(user: User): string {
    const privateKey: string = config().parsed['PRIVATE_KEY'];
    if (!privateKey) {
        throw new Error(ErrorCode.TNPK)
    }
    return sign(
        {userId: user.id, email: user.email},
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

function getDataFromToken(token: string) {
    return decode(token)
}


export {generateToken, verifyToken, getDataFromToken}