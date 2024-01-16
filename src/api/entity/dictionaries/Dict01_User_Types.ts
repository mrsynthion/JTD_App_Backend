import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

export enum Dict01_Project_User_Types_Code {
  USER = "01",
  OBSERVER = "02",
  ADMIN = "03",
}

@Entity({ name: "Dict01_Project_User_Types" })
export class Dict01_Project_User_Types {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ nullable: false })
  value: string;

  @Column("text", { nullable: false })
  code: Dict01_Project_User_Types_Code;
}
