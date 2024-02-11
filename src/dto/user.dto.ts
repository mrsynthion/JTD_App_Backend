import { ProjectBasicDto } from "./project.dto";

export interface UserBasicDto {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export type UserDto = UserBasicDto & {
  projects: ProjectBasicDto[];
};

export const userDtoKeys: (keyof UserDto)[] = [
  "id",
  "firstName",
  "lastName",
  "email",
];

export type EditUserDto = UserDto & {
  password: string;
};
