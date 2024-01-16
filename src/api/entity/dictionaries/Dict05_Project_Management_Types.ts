import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

export enum Dict05_Project_Management_Types_Code {}

@Entity({ name: "Dict05_Project_Management_Types" })
export class Dict05_Project_Management_Types {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ nullable: false })
  value: string;

  @Column("text", { nullable: false })
  code: Dict05_Project_Management_Types_Code;
}
