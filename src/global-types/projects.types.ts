import { Dict02_ProjectTypes } from "../api/entity/dictionaries/Dict02_ProjectTypes";
import { UserInProject } from "../api/entity/UserInProject";
import { Dict05_ProjectManagementTypes } from "../api/entity/dictionaries/Dict05_ProjectManagementTypes";
import { Dict01_UserInProjectTypes } from "../api/entity/dictionaries/Dict01_UserInProjectTypes";

export interface ProjectDto {
  id: string;
  name: string;
  key: string;
  type: Dict02_ProjectTypes;
  leader: any;
  users: UserInProject[];
  projectManagementType: Dict05_ProjectManagementTypes;
}

export interface AddProjectDto {
  name: string;
  key: string;
  type: Dict02_ProjectTypes;
  projectManagementType: Dict05_ProjectManagementTypes;
  userInProjectType: Dict01_UserInProjectTypes;
}
