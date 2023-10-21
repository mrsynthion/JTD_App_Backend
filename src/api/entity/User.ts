import {Column, Entity, PrimaryGeneratedColumn} from "typeorm"

@Entity()
export class User {

    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({nullable: true})
    firstName: string

    @Column({nullable: true})
    lastName: string

    @Column({nullable: false, unique: true})
    email: string

    @Column({nullable: true})
    age: number

    @Column({nullable: false, unique: true, primary: false})
    username: string

    @Column({nullable: false, primary: false})
    password: string

}
