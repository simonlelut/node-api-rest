import { Vehicle } from './Vehicle';
import { Request } from 'express';
import {Entity, Column, PrimaryGeneratedColumn, ManyToOne, getRepository, OneToMany} from "typeorm";
import faker from 'faker';
import jwt from 'jsonwebtoken';
import crypto  from "crypto";
import moment from "moment";
import { Group } from './Group';
import { type } from 'os';
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
        type: "varchar",
        unique: true
    })
    email!: string;

    @Column({
        length: 100,
        type: "varchar"
    })
    lastname!: string;

    @Column({
        type: "date"
    })
    create_at!: Date;


    @Column({
        type: "varchar",
        nullable: true
    })
    profile_image!: string;


    @ManyToOne(type => Group, group => group.users)
    group: Group

    @OneToMany(type => Vehicle, vehicle => vehicle.user)
    vehicles: Vehicle[]

    static addUsers = async (number: Number) => {

        let group = await getRepository(Group).findOne({name: "user"});

        let users= Array(number)
            .fill(null)
            .map(_ =>{
                let user  = new User();
                user.name = faker.name.firstName().toLocaleLowerCase();
                user.lastname = faker.name.lastName().toLocaleLowerCase();
                user.email = faker.internet.email(user.name,user.lastname, faker.random.number(1000).toString() )
                user.create_at = faker.date.past();
                user.profile_image = "https://s3.eu-west-3.amazonaws.com/nodeapirest/default.png";
                user.group = group
                user.setPassword("demo");    
                
                return user;
            })

        return await getRepository(User).save(users, { chunk: 10000 })
    }
    
    
    public getUser = () => {
        return {
            user: {
                id    : this.id,
                name  : this.name,
                lastname: this.lastname,
                profile_image : this.profile_image,
                create_at: moment.utc(this.create_at).format("DD-MM-YYYY"),
                email: this.email,
                group : this.group.name,
                token: this.generateJWT(),
            }
        };
    }

    static getUsers = (users) => {
        return users.map((user: User) => {
            return user.getUser();
        });
    }

    static createUser = async (user): Promise<User> => {
        let finalUser = new User();
        finalUser.lastname = user.lastname;
        finalUser.name = user.name;
        finalUser.create_at = new Date();
        finalUser.email = user.email;


        finalUser.group = await getRepository(Group).findOne({name: "user"});

        finalUser.setPassword(user.password);

        return finalUser;
    }
    
    public updateUser = (user : User): void => {
        
        Object.assign(this, user);
    }


    public setPassword = (password): void => {
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