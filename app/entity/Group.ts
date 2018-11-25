import {Entity, Column, PrimaryGeneratedColumn, OneToMany} from "typeorm";
import { User } from './User'
import faker from 'faker';
faker.locale = "fr";

export const enum GroupLevel {
    ADMIN = 1,
    USER = 0
}
@Entity()
export class Group {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({
        unique: true
    })
    name!: string;

    @Column()
    level!: number;

    @OneToMany(type => User, user => user.group)
    users: User[]

    constructor(name: string, level: number){

        this.name = name;
        this.level = level;
    }
}