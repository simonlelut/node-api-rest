import {Request, Response, NextFunction} from 'express';
import { getConnection } from "typeorm";
import LocalStrategy from "passport-local";
import {User} from "../entity/User";

export const strategy = new LocalStrategy(
    {
        usernameField: 'email',
        passwordField: 'password'
    },
    (email, password, done) => {

        getConnection().getRepository(User).findOne({email: email})
            .then((user: User) => {
                
                if(!user || !user.validatePassword(password))
                    return done(null, false, { errors: { 'email or password': 'is invalid' } });

                return done(null, user);
            })
    }

)

export const needsGroup = (group: string) => {
    return (req : Request, res : Response, next : NextFunction): void | Response => {

        if(req.user && req.user.group === group)
            next();
        
        res.status(401).send({message: "Unauthorized"});
    };
}