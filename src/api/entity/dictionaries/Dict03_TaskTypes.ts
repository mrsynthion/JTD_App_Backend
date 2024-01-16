import { Column, Entity, Generated, PrimaryGeneratedColumn } from "typeorm";

export enum Dict03_Task_Types_Code {
  EPIC = "01",
  STORY = "02",
  TASK = "03",
  BUG = "04",
  SUB_TASK = "05",
  SUB_BUG = "06",
}

@Entity({ name: "Dict03_Task_Types" })
export class Dict03_TaskTypes {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "int", nullable: false, unique: true })
  @Generated("increment")
  code: Dict03_Task_Types_Code;

  @Column("text", { nullable: false, unique: true })
  value: string;
}
