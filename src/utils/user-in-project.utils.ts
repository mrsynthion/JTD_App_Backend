import { UserInProject } from "../api/entity/UserInProject";
import {
  UserInProjectBasicDto,
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

export function mapUserInProjectToUserInProjectBasicDto(
  user: UserInProject,
): UserInProjectBasicDto {
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

export function mapUserInProjectToUserInProjectMinimumDto(
  user: UserInProject,
): UserInProjectMinimumDto {
  return {
    id: user.user!.id!,
    name: user.name!,
  };
}
