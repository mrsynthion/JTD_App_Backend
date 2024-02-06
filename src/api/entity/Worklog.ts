import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Task } from "./Task";

@Entity({ name: "Worklogs" })
export class Worklog {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  description: string;

  @Column("datetime", { nullable: false })
  startDate: Date;

  @Column("datetime", { nullable: false })
  endDate: Date;

  @ManyToOne(() => Task, (task) => task.worklogs)
  task: Task;
}
