import { Request } from 'express';
import {Entity, Column, PrimaryGeneratedColumn, ManyToOne} from "typeorm";
import Joi from 'joi';
import { querySchemaGeneric } from './../util/schema';
import faker from 'faker';
import {getConnection} from "typeorm";
import jwt from 'jsonwebtoken';
import crypto  from "crypto";
import moment from "moment";
import { Group } from './Group';
faker.locale = "fr";
@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({
        length: 100,
        type: "varchar",
        nullable: true
    })
    name!: string;

    @Column({
        length: 250,
        type: "varchar"
    })
    salt!: string;

    @Column({
        type: "text"
    })
    hash!: string;

    @Column({
        length: 250,
        type: "varchar"
    })
    email!: string;

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


    @Column({
        type: "varchar",
        nullable: true
    })
    image!: string;


    @ManyToOne(type => Group, group => group.users)
    group: Group

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
                user.image = "https://s3.eu-west-3.amazonaws.com/nodeapirest/default.png";
                return user;
            })
        
        await getConnection().getRepository(User).save(users, { chunk: 10000 })
    }

    
    public getUser = () => {
        let data = {
            user: {
                id    : this.id,
                name  : this.name,
                lastname: this.lastname,
                profile_image : this.image,
                create_at: moment.utc(this.create_at).format("DD-MM-YYYY"),
                email: this.email,
                group : this.group,
                token: this.generateJWT(),
            }
        };
        
        return data
    }

    static getUsers = (users) => {
        
        return users.map((user: User) => {
            return user.getUser();
        });
    }
    


    static createUser = (req :Request): User => {
        let user = req.body.user;
        let finalUser = new User();
        finalUser.lastname = user.lastname;
        finalUser.name = user.name;
        finalUser.create_at = new Date();
        finalUser.email = user.email;

        //finalUser.group = "efeef";

        if(req.file)
            finalUser.image = req.file.location;

        finalUser.setPassword(user.password);

        return finalUser;
    }
    
    public updateUser = (user : User): void => {

        if(user.lastname)
            this.lastname = user.lastname;

        if(user.name)
            this.name = user.name;

        if(user.image)
            this.image = user.image;
    }


    private setPassword = (password): void => {
        this.salt = crypto.randomBytes(16).toString('hex');
        this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
    }

    public validatePassword  = (password): boolean => {
        const hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
        return this.hash === hash;
    }

    protected generateJWT = () => {
        const today = new Date();
        const expirationDate = new Date(today);
        expirationDate.setDate(today.getDate() + 60);
      
        return jwt.sign({
          email: this.email,
          id: this.id,
          exp: expirationDate.getTime() / 1000,
        }, 'secret');
    }

}