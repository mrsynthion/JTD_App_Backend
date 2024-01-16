import { UserInProject } from "../api/entity/UserInProject";

export interface UserDto {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  projects: UserInProject[];
}
