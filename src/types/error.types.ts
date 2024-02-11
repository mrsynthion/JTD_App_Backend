export enum ErrorCode {
  //TOKEN
  TOKEN_NPK = "No private key",
  TOKEN_UTGT = "Unable to generate token",
  TOKEN_TE = "Token expired",
  TOKEN_WT = "Token wrong token",

  //AUTH
  AUTH_PDNM = "Passwords do not match",
  AUTH_PIR = "Password is required",
  AUTH_PSHMTCALOSCOBCONOSC = "Password should have minimum ten characters,at least one small character, one big character, one number, one special character",
  AUTH_EIR = "Email is required",
  AUTH_TEIAIU = "This email is already in use",
  AUTH_FNIR = "First name is required",
  AUTH_LNIR = "Last name is required",
  AUTH_CNFU = "Can not find user",

  // USER
  USER_NVII = "No valid id included",
  USER_CNFU = "Can not find user",

  //TASK
  TASK_TIR = "Title is required",
  TASK_TMBMFC = "Title must be minimum five characters",
  TASK_TTIR = "Task type is required",
  TASK_TECNHPT = "Type epic can not have parent task",
  TASK_TME = "Task must exist",
  TASK_TTCNHC = "This task can not have children",
  TASK_TSME = "Task status must exist",

  //PROJECT
  PROJECT_KIR = "Key is required",
  PROJECT_KMBMTC = "Key must be max ten characters",
  PROJECT_NIR = "Name is required",
  PROJECT_TIR = "Project type is required",
  PROJECT_MTIR = "Project management type is required",
  PROJECT_UIPTIR = "User in project type is required",
  PROJECT_NLME = "New leader must exist",
  PROJECT_PME = "Project must exist",
  PROJECT_YMPMOVTC = "You must provide minimum one value to change",
  PROJECT_IIR = "Project id is required",
  PROJECT_LIIR = "Project leader id is required",
  PROJECT_PDSE = "Project does not exist",
  PROJECT_UINMOTP = "User is not member of this project",

  //SERVER
  SERVER_ISE = "Internal server error",
  SERVER_PNF = "Path not found",
  SERVER_UNA = "Unauthorized",
  SERVER_FOR = "Forbidden",
}
