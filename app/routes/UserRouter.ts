import { querySchemaGeneric } from './../util/schema';
import express from 'express';
import UserController from '../controllers/User';
import {User} from "../entity/User";
import faker from 'faker';
import {getConnection} from "typeorm";
import Joi from 'joi';
const validator = require('express-joi-validation')({passError: true})

/*
    /users
*/
const addUsers = async (number) => {
    let users: User[] = [];
    for(let i = 0; i < number; i++){
        let user = new User();
        user.name = faker.name.findName();
        user.username = faker.name.findName();
        users.push(user);
    }
    await getConnection().getRepository(User).save(users)
}

const querySchema = querySchemaGeneric.keys({
    name: Joi
        .string()
        .regex(/\b[^\d\W]+\b/),
    username: Joi
        .string()
        .regex(/\b[^\d\W]+\b/),
        
})

export default express()

    .get('/', validator.query(querySchema),UserController.getAll)
    .get('/:userId', UserController.get)
    .post('/', UserController.create)
    .patch('/:userId', UserController.patch)
    .put('/:userId', UserController.put)
    .delete('/:userId', UserController.delete)

    .param("userId", UserController.userId)
    .get('/populate/:nbPopulate', async (req,res) =>{
        await addUsers(req.params.nbPopulate);
        res.status(200).json({message : `add ${req.params.nbPopulate} users`});
        
    })
    .get('/test/delete', async (req,res) =>{
        await getConnection().getRepository(User).query(`TRUNCATE TABLE "user" RESTART IDENTITY;`)
        res.status(200).json({message : `delete all users`});
    })

