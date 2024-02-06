import { ProjectMinimumDto } from "./project.dto";

export interface UserMinimumDto {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export type UserDto = UserMinimumDto & {
  projects: ProjectMinimumDto[];
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
