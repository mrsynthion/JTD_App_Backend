import {User} from "../api/entity/User";
import {ErrorCode} from "../global-types/error.types";

function validatePassword(password: string): void {
    if (!password) throw new Error(ErrorCode.PIR)
    const isMinTenChars: boolean = password.length >= 10;
    const isMinOneBigChars: boolean = /[A-Z]/.test(password);
    const isMinOneSmalChars: boolean = /[a-z]/.test(password);
    const isMinOneNumber: boolean = /[0-9]/.test(password);
    const isMinOneSymbol: boolean = /[^A-Za-z0-9]/.test(password);

    const isPasswordCorrect: boolean = isMinTenChars && isMinOneBigChars && isMinOneSmalChars && isMinOneNumber && isMinOneSymbol;

    if (!isPasswordCorrect) throw new Error(ErrorCode.PSHMTCALOSCOBCONOSC)
}

function validateEmail(email: string): void {
    if (!email) throw new Error(ErrorCode.EIR)
}

function validateUsername(username: string): void {
    if (!username) throw new Error(ErrorCode.UIR)
}

function validateSignUpData({password, email, username}: User): void {
    validateUsername(username);
    validateEmail(email);
    validatePassword(password)
}


export {validateSignUpData, validateEmail, validateUsername, validatePassword}