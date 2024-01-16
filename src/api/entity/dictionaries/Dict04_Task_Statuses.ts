import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

export enum Dict04_Task_Statuses_Code {
  TO_DO = "01",
  IN_PROGRESS = "02",
  CODE_REVIEW = "03",
  READY_FOR_TEST = "04",
  IN_TEST = "05",
  DONE = "06",
  WONT_DO = "07",
  BLOCKED = "08",
}

@Entity({ name: "Dict04_Task_Statuses" })
export class Dict04_Task_Statuses {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ nullable: false })
  value: string;

  @Column("text", { nullable: false })
  code: Dict04_Task_Statuses_Code;
}
