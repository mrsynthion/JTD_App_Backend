import { UserInProject } from "../api/entity/UserInProject";
import {
  UserInProjectDto,
  UserInProjectMinimumDto,
} from "../dto/user-in-project.dto";

export function mapUserInProjectToUserInProjectDto(
  user: UserInProject,
): UserInProjectDto {
  return {
    id: user.user!.id!,
    firstName: user.user!.firstName!,
    lastName: user.user!.lastName!,
    email: user.user!.email!,
    name: user.name!,
    isLeader: !!user.leader?.id,
    memberType: user.type!,
    tasks: user.tasks,
  };
}

export function mapUserInProjectToUserInProjectMinimumDto(
  user: UserInProject,
): UserInProjectMinimumDto {
  return {
    id: user.user!.id!,
    firstName: user.user!.firstName!,
    lastName: user.user!.lastName!,
    email: user.user!.email!,
    name: user.name!,
    isLeader: !!user.leader?.id,
    memberType: user.type!,
  };
}
