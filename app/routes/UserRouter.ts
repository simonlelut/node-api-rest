import express from 'express';
import UserController from '../controllers/User';
import {User} from "../entity/User";
import {getConnection} from "typeorm";
const validator = require('express-joi-validation')({passError: true})
import { auth } from '../util/auth';
import { GroupLevel }from '../entity/Group'
import { needsGroup } from '../util/middleware';


/*
    /users
*/
export default express()

    .get('/', auth.optional, validator.query(User.querySchema),auth.optional , UserController.getAll)
    .post('/', auth.optional, UserController.create)

    .get('/login', auth.required , UserController.current)
    .post('/login', auth.optional, UserController.login)
   
    .get('/:userId', auth.required, needsGroup(GroupLevel.USER)  , UserController.get)
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