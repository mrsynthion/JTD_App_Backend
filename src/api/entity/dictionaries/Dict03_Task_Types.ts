import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

export enum Dict03_Task_Types_Code {
  EPIC = "01",
  STORY = "02",
  TASK = "03",
  BUG = "04",
  SUB_TASK = "05",
  SUB_BUG = "06",
}

@Entity({ name: "Dict03_Task_Types" })
export class Dict03_Task_Types {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ nullable: false })
  value: string;

  @Column("text", { nullable: false })
  code: Dict03_Task_Types_Code;
}
