import { Column, Entity, Generated, PrimaryGeneratedColumn } from "typeorm";

export enum Dict05_Project_Management_Types_Code {}

@Entity({ name: "Dict05_Project_Management_Types" })
export class Dict05_ProjectManagementTypes {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "int", nullable: false, unique: true })
  @Generated("increment")
  code: Dict05_Project_Management_Types_Code;

  @Column("text", { nullable: false, unique: true })
  value: string;
}
