import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Dict02_Project_Types } from "./dictionaries/Dict02_Project_Types";
import { UserInProject } from "./UserInProject";
import { Dict05_Project_Management_Types } from "./dictionaries/Dict05_Project_Management_Types";

@Entity({ name: "Projects" })
export class Project {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  key: string;

  @ManyToOne(() => Dict02_Project_Types, { nullable: false })
  @JoinColumn()
  type: Dict02_Project_Types;

  @OneToOne(() => UserInProject, { nullable: false })
  @JoinColumn()
  leader: UserInProject;

  @OneToMany(() => UserInProject, (userInProject) => userInProject.project)
  users: UserInProject[];

  @ManyToOne(() => Dict05_Project_Management_Types, { nullable: false })
  @JoinColumn()
  projectManagementType: Dict05_Project_Management_Types;
}
