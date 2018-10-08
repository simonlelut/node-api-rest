import {Entity, Column, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({
        length: 100
    })
    name!: string;

    @Column({
        length: 100,
        nullable: true
    })
    username!: string;

    static filters : string[] = ["name","username"];
}