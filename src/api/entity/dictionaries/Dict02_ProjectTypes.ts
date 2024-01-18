import { Column, Entity, Generated, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "Dict02_Project_Types" })
export class Dict02_ProjectTypes {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "int", nullable: false, unique: true })
  @Generated("increment")
  code: number;

  @Column("text", { nullable: false, unique: true })
  value: string;
}
