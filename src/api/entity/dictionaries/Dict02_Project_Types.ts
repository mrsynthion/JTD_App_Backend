import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

export enum Dict02_Project_Types_Code {
  SCRUM = "01",
  KANBAN = "02",
}

@Entity({ name: "Dict02_Project_Types" })
export class Dict02_Project_Types {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ nullable: false })
  value: string;

  @Column("text", { nullable: false })
  code: Dict02_Project_Types_Code;
}
