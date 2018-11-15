import {Entity, Column, PrimaryGeneratedColumn, OneToMany} from "typeorm";
import { User } from './User'
import faker from 'faker';
faker.locale = "fr";
@Entity()

export class Group {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({
        length: 100,
        type: "varchar",
        nullable: true
    })
    name!: string;

    @OneToMany(type => User, user => user.group)
    users: User[]

    constructor(name: string){

        this.name = name;
    }


}