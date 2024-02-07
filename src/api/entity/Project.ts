import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { UserInProject } from "./UserInProject";
import { ProjectManagementType, ProjectTypes } from "../../types/project.types";
import { Task } from "./Task";

@Entity({ name: "Projects" })
export class Project {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  key: string;

  @Column({ nullable: false })
  type: ProjectTypes;

  @OneToOne(() => UserInProject)
  @JoinColumn()
  leaderInProject: UserInProject | null;

  @OneToMany(() => UserInProject, (userInProject) => userInProject.project)
  usersInProject: UserInProject[];

  @Column({ nullable: false })
  projectManagementType: ProjectManagementType;

  @OneToMany(() => Task, (task) => task.project)
  tasks: Task[];
}
