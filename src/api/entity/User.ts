import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { UserInProject } from "./UserInProject";

@Entity({ name: "Users" })
export class User {
  @PrimaryGeneratedColumn("uuid")
  id?: string;

  @Column({ nullable: false })
  firstName?: string;

  @Column({ nullable: false })
  lastName?: string;

  @Column({ nullable: false, unique: true })
  email?: string;

  @Column({ nullable: false })
  password?: string;

  @OneToMany(() => UserInProject, (userInProject) => userInProject.user)
  userInProjects?: UserInProject[];
}
