import { Column, Entity, Generated, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "Dict01_User_In_Project_Types" })
export class Dict01_UserInProjectTypes {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "int", nullable: false, unique: true })
  @Generated("increment")
  code: number;

  @Column("text", { nullable: false, unique: true })
  value: string;
}
