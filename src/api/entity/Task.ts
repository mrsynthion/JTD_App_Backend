import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { UserInProject } from "./UserInProject";
import { TaskStatus, TaskType } from "../../types/task.types";

@Entity({ name: "Tasks" })
export class Task {
  @PrimaryGeneratedColumn("uuid")
  id?: string;

  @Column({ nullable: false })
  title?: string;

  @Column({ nullable: true })
  description?: string;

  @Column("datetime", { nullable: false })
  createdAt?: Date;

  @Column("text", { nullable: true })
  label?: string;

  @Column({ nullable: false })
  type?: TaskType;

  @Column({ nullable: false })
  status?: TaskStatus;

  @ManyToOne(() => UserInProject, (userInProject) => userInProject.tasks, {
    onDelete: "CASCADE",
  })
  assignedUser?: UserInProject;

  @OneToMany(() => Task, (task) => task.parentTask)
  childrenTasks?: Task[];

  @ManyToOne(() => Task, (task) => task.childrenTasks)
  parentTask?: Task;
}
