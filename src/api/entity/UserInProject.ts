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
import { Task } from "./Task";
import { Dict01_UserInProjectTypes } from "./dictionaries/Dict01_UserInProjectTypes";

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

  @ManyToOne(() => Project, (project) => project.users, { nullable: false })
  project: Project;

  @ManyToOne(() => User, (user) => user.projects, { nullable: false })
  user: User;

  @ManyToOne(() => Dict01_UserInProjectTypes, { nullable: false })
  @JoinColumn()
  type: Dict01_UserInProjectTypes;

  @OneToMany(() => Task, (task) => task.assignedUser)
  tasks: Task[];
}
