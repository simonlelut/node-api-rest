import {Entity, Column, PrimaryGeneratedColumn} from "typeorm";
import Joi from 'joi';
import { querySchemaGeneric } from './../util/schema';
import faker from 'faker';
import {getConnection} from "typeorm";
import async from "async";
import moment from "moment";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({
        length: 100,
        type: "varchar"
    })
    name!: string;

    @Column({
        length: 100,
        type: "varchar"
    })
    username!: string;

    @Column({
        type: "date"
    })
    create_at!: Date;

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
        day: Joi
            .string(),
        month: Joi
            .string(),
        year: Joi
            .string(),
    })

    static addUsers = async (number) => {
        let users: User[] = [];

        for(let i = 0; i < number; i++){

            if(users.length > 10000){
                await getConnection().getRepository(User).save(users, { chunk: 10000 })
                console.log("add 10K users")
                users = [];
            }
            let user = new User();
            user.name = faker.name.findName().toLocaleLowerCase();
            user.username = faker.name.findName().toLocaleLowerCase();
            user.create_at = faker.date.past();
            await users.push(user);
        }

        await getConnection().getRepository(User).save(users, { chunk: 10000 })
    }

    static getUser = (user : User) => {
        let data = {
            "id"    : user.id,
            "name"  : user.name,
            "username": user.username,
            "create_at": moment.utc(user.create_at).format("DD-MM-YYYY")
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