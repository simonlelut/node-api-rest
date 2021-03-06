import { Response, NextFunction} from 'express';
import { getConnection } from "typeorm";
import LocalStrategy from "passport-local";
import {User} from "../entity/User";
import { getRepository } from "typeorm";

export const strategy = new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    },
    (email: string, password: string, done: Function ) : void => {
        
        getConnection().getRepository(User).findOne({email: email}, {relations: ["group"]})
            .then((user: User) => {
                if(!user || !user.validatePassword(password))
                    return done(null, false, { error: 'email or password invalid' });

                return done(null, user);
            })
    }
)

/**
 * 
 * @param group string
 */
export const needsGroup = (groupLevel: number) => {
    return async (req , res : Response, next : NextFunction)=> {
        
        let user = await getRepository(User).findOne(req.payload.id, {relations: ["group"]});  
        
        if(user.group.level >= groupLevel)
            return next();
        res.status(401).send({message: "Unauthorized"});
    };
}