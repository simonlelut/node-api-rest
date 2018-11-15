import express from 'express';
import UserController from '../controllers/User';
import {User} from "../entity/User";
import {getConnection} from "typeorm";
const validator = require('express-joi-validation')({passError: true})
import path  from "path";
import { auth } from '../util/auth';




/*
    /users
*/
export default express()

    .get('/', auth.required, validator.query(User.querySchema),auth.optional ,UserController.getAll)
    .get('/login', auth.required , UserController.current)
    .get('/:userId', auth.required , UserController.get)
    .post('/login', auth.optional, UserController.login)
    .post('/', auth.optional, UserController.create)
    .put('/:userId', auth.required, UserController.put)
    .delete('/:userId', auth.required, UserController.delete)
    .param("userId", UserController.userId)


    .get('/populate/:nbPopulate', async (req,res) =>{
        await User.addUsers(Number(req.params.nbPopulate));
        res.status(200).json({message : `add ${req.params.nbPopulate} users`});
        
    })
    .get('/test/delete', async (req,res) =>{
        await getConnection().getRepository(User).query(`TRUNCATE TABLE "user" RESTART IDENTITY;`)
        res.status(200).json({message : `delete all users`});
    })