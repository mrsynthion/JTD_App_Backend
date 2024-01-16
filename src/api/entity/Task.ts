import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { UserInProject } from "./UserInProject";
import { Dict03_Task_Types } from "./dictionaries/Dict03_Task_Types";
import { Dict04_Task_Statuses } from "./dictionaries/Dict04_Task_Statuses";

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

  @ManyToOne(() => Dict03_Task_Types, { nullable: false })
  @JoinColumn()
  type: Dict03_Task_Types;

  @ManyToOne(() => Dict04_Task_Statuses, { nullable: false })
  @JoinColumn()
  status: Dict04_Task_Statuses;

  @ManyToOne(() => UserInProject, (userInProject) => userInProject.tasks, {
    onDelete: "CASCADE",
  })
  assignedUser: UserInProject;

  @OneToMany(() => Task, (task) => task.parentTask)
  childrenTasks: Task[];

  @ManyToOne(() => Task, (task) => task.childrenTasks)
  parentTask: Task;
}
