import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Task } from "./Task";

@Entity({ name: "WorkLogs" })
export class WorkLog {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  description: string;

  @Column("datetime", { nullable: false })
  startDate: Date;

  @Column("datetime", { nullable: false })
  endDate: Date;

  @ManyToOne(() => Task, (task) => task.workLogs)
  task: Task;
}
