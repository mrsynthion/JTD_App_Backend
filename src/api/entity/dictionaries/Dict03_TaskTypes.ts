import { Column, Entity, Generated, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "Dict03_Task_Types" })
export class Dict03_TaskTypes {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "int", nullable: false, unique: true })
  @Generated("increment")
  code: number;

  @Column("text", { nullable: false, unique: true })
  value: string;
}
