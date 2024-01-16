import { Column, Entity, Generated, PrimaryGeneratedColumn } from "typeorm";

export enum Dict02_Project_Types_Code {
  SCRUM = "01",
  KANBAN = "02",
}

@Entity({ name: "Dict02_Project_Types" })
export class Dict02_ProjectTypes {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "int", nullable: false, unique: true })
  @Generated("increment")
  code: Dict02_Project_Types_Code;

  @Column("text", { nullable: false, unique: true })
  value: string;
}
