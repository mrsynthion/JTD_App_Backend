import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Project } from "./Project";
import { User } from "./User";
import { Dict01_Project_User_Types } from "./dictionaries/Dict01_User_Types";
import { Task } from "./Task";

@Entity({
  name: "UsersInProjects",
})
export class UserInProject {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  isLeader: boolean;

  @ManyToOne(() => Project, (project) => project.users)
  project: Project;

  @ManyToOne(() => User, (user) => user.projects, { nullable: false })
  user: User;

  @ManyToOne(() => Dict01_Project_User_Types, { nullable: false })
  @JoinColumn()
  type: Dict01_Project_User_Types;

  @OneToMany(() => Task, (task) => task.assignedUser)
  tasks: Task[];
}
