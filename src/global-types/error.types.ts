enum ErrorCode {
    //TOKEN
    NPK = 'NO PRIVATE KEY',
    UTGT = 'UNABLE TO GENERATE TOKEN',
    TE = 'TOKEN EXPIRED',
    //AUTH
    ALDM = 'ALL LOGIN DATA MISSING',
    CNFU = 'CAN NOT FIND USER',
    PDNM = 'PASSWORDS DO NOT MATCH',
    //SIGNUP
    PIR = 'PASSWORD IS REQUIRED',
    PSHMTCALOSCOBCONOSC = "PASSWORD SHOULD HAVE MINIMUM TEN CHARACTERS,AT LEAST ONE SMALL CHARACTER, ONE BIG CHARACTER, ONE NUMBER, ONE SPECIAL CHARACTER",
    EIR = 'EMAIL IS REQUIRED',
    TEIAIU = 'THIS EMAIL IS ALREADY IN USE',
    UIR = 'USERNAME IS REQUIRED',
    TUIAIU = 'THIS USERNAME IS ALREADY IN USE',
    //EDIT UER
    NVII = 'NO VALID ID INCLUDED'

}


export {ErrorCode}