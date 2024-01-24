import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Dict02_ProjectTypes } from "./dictionaries/Dict02_ProjectTypes";
import { UserInProject } from "./UserInProject";
import { Dict05_ProjectManagementTypes } from "./dictionaries/Dict05_ProjectManagementTypes";

@Entity({ name: "Projects" })
export class Project {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  key: string;

  @ManyToOne(() => Dict02_ProjectTypes, { nullable: false })
  @JoinColumn()
  type: Dict02_ProjectTypes;

  @OneToOne(() => UserInProject)
  @JoinColumn()
  leader: UserInProject;

  @OneToMany(() => UserInProject, (userInProject) => userInProject.project)
  users: UserInProject[];

  @ManyToOne(() => Dict05_ProjectManagementTypes, { nullable: false })
  @JoinColumn()
  projectManagementType: Dict05_ProjectManagementTypes;
}
