import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Project } from "./Project";
import { User } from "./User";
import { Task } from "./Task";
import { UserInProjectType } from "../../types/user.types";

@Entity({
  name: "UsersInProjects",
})
export class UserInProject {
  @PrimaryGeneratedColumn("uuid")
  id?: string;

  @Column({ nullable: false })
  name?: string;

  @Column({ nullable: false, default: false })
  isLeader?: boolean;

  @ManyToOne(() => Project, (project) => project.usersInProject, {
    nullable: false,
  })
  project?: Project;

  @ManyToOne(() => User, (user) => user.userInProjects, { nullable: false })
  user?: User;

  @Column({ nullable: false })
  type?: UserInProjectType;

  @OneToMany(() => Task, (task) => task.assignedUser)
  tasks?: Task[];
}
