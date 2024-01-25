import { Repository } from "typeorm";
import { AppDataSource } from "../../data-source";
import { Project } from "../entity/Project";
import { AddProjectDto, ProjectDto } from "../../global-types/projects.types";
import { UserDto } from "../../global-types/user.types";
import { UserInProject } from "../entity/UserInProject";
import { validateAddProjectData } from "../../utils/project.utils";

const projectRepository: Repository<Project> =
  AppDataSource.getRepository(Project);

const userInProjectRepository: Repository<UserInProject> =
  AppDataSource.getRepository(UserInProject);

async function addProject(
  addProject: AddProjectDto,
  currentUser: UserDto,
): Promise<ProjectDto> {
  try {
    await validateAddProjectData(addProject);

    const newProject: ProjectDto = await projectRepository.save(addProject);
    const addUserInProject: UserInProject = {
      name: currentUser.firstName,
      isLeader: true,
      user: currentUser,
      project: newProject,
      type: addProject.userInProjectType,
    } as UserInProject;
    const newUserInProject: UserInProject =
      await userInProjectRepository.save(addUserInProject);

    await projectRepository.update(
      { id: newProject.id },
      {
        leader: newUserInProject,
      },
    );
    return await projectRepository.findOne({
      where: {
        id: newProject.id,
      },
      relations: {
        projectManagementType: true,
        type: true,
        leader: true,
      },
    });
  } catch ({ message }) {
    throw new Error(message);
  }
}

async function getProjectById(id: string): Promise<ProjectDto> {
  try {
    return await projectRepository.findOne({
      where: {
        id,
      },
      relations: {
        projectManagementType: true,
        type: true,
        leader: true,
      },
    });
  } catch ({ message }) {
    throw new Error(message);
  }
}

export const ProjectsControllerFunctions = { addProject, getProjectById };
