enum ErrorCode {
    //TOKEN
    TNPK = 'NO PRIVATE KEY',
    TUTGT = 'UNABLE TO GENERATE TOKEN',
    TTE = 'TOKEN EXPIRED',
    //AUTH
    AALDM = 'ALL LOGIN DATA MISSING',
    ACNFU = 'CAN NOT FIND USER',
    APDNM = 'PASSWORDS DO NOT MATCH',
    //SIGNUP
    PIR = 'PASSWORD IS REQUIRED',
    PSHMTCALOSCOBCONOSC = "PASSWORD SHOULD HAVE MINIMUM TEN CHARACTERS,AT LEAST ONE SMALL CHARACTER, ONE BIG CHARACTER, ONE NUMBER, ONE SPECIAL CHARACTER",
    EIR = 'EMAIL IS REQUIRED',
    TEIAIU = 'THIS EMAIL IS ALREADY IN USE',
    UIR = 'USERNAME IS REQUIRED',
    TUIAIU = 'THIS USERNAME IS ALREADY IN USE',
    //EDIT USER
    NVII = 'NO VALID ID INCLUDED',
    //TASK
    TTIR = 'TITLE IS REQUIRED',
    TTMBMFC = 'TITLE MUST BE MINIMUM FIVE CHARACTERS'
}


export {ErrorCode}