export enum ErrorCode {
  //TOKEN
  TNPK = "NO PRIVATE KEY",
  UTGT = "UNABLE TO GENERATE TOKEN",
  //AUTH
  ACNFU = "CAN NOT FIND USER",
  APDNM = "PASSWORDS DO NOT MATCH",
  //SIGNUP
  PIR = "PASSWORD IS REQUIRED",
  PSHMTCALOSCOBCONOSC = "PASSWORD SHOULD HAVE MINIMUM TEN CHARACTERS,AT LEAST ONE SMALL CHARACTER, ONE BIG CHARACTER, ONE NUMBER, ONE SPECIAL CHARACTER",
  EIR = "EMAIL IS REQUIRED",
  TEIAIU = "THIS EMAIL IS ALREADY IN USE",
  FNIR = "FIRST NAME IS REQUIRED",
  LNIR = "LAST NAME IS REQUIRED",
  //EDIT USER
  NVII = "NO VALID ID INCLUDED",
  //TASK
  TTIR = "TITLE IS REQUIRED",
  TTMBMFC = "TITLE MUST BE MINIMUM FIVE CHARACTERS",
  //DICTS
  DVCNBD = "DICT VALUES CAN NOT BE DUPLICATED",
  DVDNE = "DICT VALUE DOES NOT EXIST",
}
