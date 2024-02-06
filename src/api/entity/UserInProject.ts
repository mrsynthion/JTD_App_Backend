import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
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
  id: string;

  @Column({ nullable: false })
  name: string;

  @ManyToOne(() => Project, (project) => project.usersInProject, {
    nullable: false,
  })
  project: Project;

  @ManyToOne(() => User, (user) => user.userInProjects, { nullable: false })
  user: User;

  @Column({ nullable: false })
  type: UserInProjectType;

  @OneToOne((type) => Project, (project) => project.leaderInProject)
  leader: UserInProject | null;

  @OneToMany(() => Task, (task) => task.assignedUser)
  @JoinColumn()
  tasks: Task[];
}
