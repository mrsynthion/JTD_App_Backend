import { UserDto } from "../dto/user.dto";
import { User } from "../api/entity/User";
import { mapProjectToProjectMinimumDto } from "./project.utils";

export function mapUserToUserDto(user: User): UserDto {
  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    projects: user.userInProjects.map((uip) =>
      mapProjectToProjectMinimumDto(uip.project),
    ),
  };
}
