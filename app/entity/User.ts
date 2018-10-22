import {Entity, Column, PrimaryGeneratedColumn} from "typeorm";
import Joi from 'joi';
import { querySchemaGeneric } from './../util/schema';
import faker from 'faker';
import {getConnection} from "typeorm";
import async from "async";
import moment from "moment";
faker.locale = "fr";
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
        type: "varchar",
        nullable: true
    })
    lastname!: string;

    @Column({
        type: "date",
        nullable: true
    })
    create_at!: Date;

    static filters : string[] = ["name","lastname"];

    static querySchema = querySchemaGeneric.keys({
        sort: Joi
            .string(),
        desc: Joi
            .string(),
        name: Joi
            .string()
            .regex(/\b[^\d\W]+\b/),
        lastname: Joi
            .string()
            .regex(/\b[^\d\W]+\b/),
        day: Joi
            .string(),
        month: Joi
            .string(),
        year: Joi
            .string(),
    })

    static addUsers = async (number: Number) => {

        let users = Array(number)
            .fill(null)
            .map( _ =>{
                let user  = new User();
                user.name = faker.name.firstName().toLocaleLowerCase();
                user.lastname = faker.name.lastName().toLocaleLowerCase();
                user.create_at = faker.date.past();
                return user;
            })
        
        await getConnection().getRepository(User).save(users, { chunk: 10000 })
    }

    static getUser = (user : User) => {
        let data = {
            "id"    : user.id,
            "name"  : user.name,
            "lastname": user.lastname,
            "create_at": moment.utc(user.create_at).format("DD-MM-YYYY")
        };
        
        return data
    }

    static getUsers = (users) => {
        return users.map(user => {
            return User.getUser(user);
        });
    }
    
}