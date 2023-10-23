import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm"
import {User} from "./User";

export enum ImportanceLevel {
    LOW = 'LOW',
    MEDIUM = 'MEDIUM',
    HIGH = 'HIGH',
    VERY_HIGH = 'VERY_HIGH'
}

@Entity()
export class Task {

    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    title: string

    @Column()
    description: string

    @Column('text')
    importanceLevel: ImportanceLevel

    @Column('datetime')
    createdAt: Date

    @Column('datetime')
    expirationDate: Date

    @ManyToOne(() => User, (user) => user.tasks, {onDelete: 'CASCADE'})
    user: User
}
