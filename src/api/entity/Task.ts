import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { UserInProject } from "./UserInProject";
import { Dict03_TaskTypes } from "./dictionaries/Dict03_TaskTypes";
import { Dict04_TaskStatuses } from "./dictionaries/Dict04_TaskStatuses";

@Entity({ name: "Tasks" })
export class Task {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ nullable: false })
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column("datetime", { nullable: false })
  createdAt: Date;

  @Column("text", { nullable: true })
  label: string;

  @ManyToOne(() => Dict03_TaskTypes, { nullable: false })
  @JoinColumn()
  type: Dict03_TaskTypes;

  @ManyToOne(() => Dict04_TaskStatuses, { nullable: false })
  @JoinColumn()
  status: Dict04_TaskStatuses;

  @ManyToOne(() => UserInProject, (userInProject) => userInProject.tasks, {
    onDelete: "CASCADE",
  })
  assignedUser: UserInProject;

  @OneToMany(() => Task, (task) => task.parentTask)
  childrenTasks: Task[];

  @ManyToOne(() => Task, (task) => task.childrenTasks)
  parentTask: Task;
}
