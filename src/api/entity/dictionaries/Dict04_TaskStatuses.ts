import { Column, Entity, Generated, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "Dict04_Task_Statuses" })
export class Dict04_TaskStatuses {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "int", nullable: false, unique: true })
  @Generated("increment")
  code: number;

  @Column("text", { nullable: false, unique: true })
  value: string;
}
