import {Entity, Column, PrimaryGeneratedColumn} from "typeorm";
import Joi from 'joi';
import { querySchemaGeneric } from './../util/schema';
import faker from 'faker';
import {getConnection} from "typeorm";
import async from "async";

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

    static querySchema = querySchemaGeneric.keys({
        sort: Joi
            .string()
            .valid(User.filters),
        desc: Joi
            .string()
            .valid(User.filters),
        name: Joi
            .string()
            .regex(/\b[^\d\W]+\b/),
        username: Joi
            .string()
            .regex(/\b[^\d\W]+\b/),
    })

    static addUsers = async (number) => {
        let users: User[] = [];
        for(let i = 0; i < number; i++){
            let user = new User();
            user.name = faker.name.findName();
            user.username = faker.name.findName();
            users.push(user);
        }
        await getConnection().getRepository(User).save(users)
    }

    static getUser = (user : User) => {
        let data = {
            "id"    : user.id,
            "name"  : user.name,
            "username": user.username
        };
        if(data.username === null)
            delete data.username;

        return data
    }

    static getUsers = (users) => {
        let result = [];
        async.forEachOf(users, (user)=>{
            result.push(User.getUser(user as User))
        })
        return result;
    }
    
}