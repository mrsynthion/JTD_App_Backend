import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { UserInProject } from "./UserInProject";
import { ProjectManagementType, ProjectType } from "../../types/projectType";

@Entity({ name: "Projects" })
export class Project {
  @PrimaryGeneratedColumn("uuid")
  id?: string;

  @Column({ nullable: false })
  name?: string;

  @Column({ nullable: false })
  key?: string;

  @Column({ nullable: false })
  type?: ProjectType;

  @OneToOne(() => UserInProject)
  @JoinColumn()
  leaderInProject?: UserInProject;

  @OneToMany(() => UserInProject, (userInProject) => userInProject.project)
  usersInProject?: UserInProject[];

  @Column({ nullable: false })
  projectManagementType?: ProjectManagementType;
}
