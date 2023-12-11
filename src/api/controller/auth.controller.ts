import {validateSignUpData} from "../../utils/auth.utils";
import {compare, hash} from "bcrypt";
import {ErrorCode} from "../../global-types/error.types";
import {sendError} from "../../utils/error.utils";
import {User} from "../entity/User";
import {Response} from "express";
import {AppDataSource} from "../../data-source";
import {generateToken, verifyToken} from "../../utils/token-managements.utils";
import {saltRounds, TokenName} from "../../global-types/auth.types";

const userRepository = AppDataSource.getRepository(User)

async function signup(user: User, res: Response): Promise<void> {
    try {
        validateSignUpData(user)
        const hashedPass: string = await hash(user.password, saltRounds);
        user = {...user, password: hashedPass}
        const newUser = await userRepository.save(user)
        delete newUser['password']
        res.statusCode = 201;
        res.json(newUser)
    } catch ({message}) {
        let newMessage: ErrorCode = message;
        if (message.includes('uq1')) newMessage = ErrorCode.TEIAIU;
        if (message.includes('uq2')) newMessage = ErrorCode.TUIAIU;

        sendError(400, newMessage, res)
    }
}

async function login(username: string, password: string, res: Response): Promise<void> {
    if (!username || !password) {
        sendError(400, ErrorCode.AALDM, res)
        return;
    }
    try {
        const user: User = await userRepository.findOne({
            where: {
                username
            }
        })
        if (!user) throw new Error(ErrorCode.ACNFU)

        const result = await compare(password, user.password);
        if (result !== true) throw new Error(ErrorCode.APDNM);

        const token = generateToken(user);
        delete user['password']
        res.statusCode = 200;
        res.cookie(TokenName, token, {httpOnly: true});
        res.json(user)
    } catch ({message}) {
        sendError(400, message, res)
    }
}

async function logout(res: Response): Promise<void> {
    try {
        res.clearCookie(TokenName)
        res.statusCode = 200;
        res.send('Succesfully logout')
    } catch ({message}) {
        sendError(400, message, res)
    }
}

async function verifyUserToken(token: string, res: Response): Promise<void> {
    try {
        verifyToken(token)
        res.json({isValidToken: true})
    } catch ({message}) {
        res.json({isValidToken: false})
    }
}

export const AuthControllerFunctions = {
    login,
    signup,
    logout,
    verifyUserToken
}