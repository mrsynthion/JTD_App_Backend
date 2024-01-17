import { Column, Entity, Generated, PrimaryGeneratedColumn } from "typeorm";
import { Dict01_Project_User_Types_Code } from "../../../global-types/dictionaries/Dict01_UserTypes.types";

@Entity({ name: "Dict01_User_In_Project_Types" })
export class Dict01_UserInProjectTypes {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "int", nullable: false, unique: true })
  @Generated("increment")
  code: Dict01_Project_User_Types_Code;

  @Column("text", { nullable: false, unique: true })
  value: string;
}
