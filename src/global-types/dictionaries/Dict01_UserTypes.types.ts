export enum Dict01_Project_User_Types_Code {
  USER = "01",
  OBSERVER = "02",
  ADMIN = "03",
}

export interface UserInProjectType {
  id: string;
  value: string;
  code: Dict01_Project_User_Types_Code;
}

export interface AddUserInProjectType {
  value: string;
}

export interface EditUserInProjectType {
  value: string;
}
