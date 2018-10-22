import express from 'express';
import UserController from '../controllers/User';
import {User} from "../entity/User";
import {getConnection} from "typeorm";
const validator = require('express-joi-validation')({passError: true})

/*
    /users
*/
export default express()

    .get('/', validator.query(User.querySchema),UserController.getAll)
    .get('/:userId', UserController.get)
    .post('/', UserController.create)
    .patch('/:userId', UserController.patch)
    .put('/:userId', UserController.put)
    .delete('/:userId', UserController.delete)

    .param("userId", UserController.userId)
    .get('/populate/:nbPopulate', async (req,res) =>{
        await User.addUsers(Number(req.params.nbPopulate));
        res.status(200).json({message : `add ${req.params.nbPopulate} users`});
        
    })
    .get('/test/delete', async (req,res) =>{
        await getConnection().getRepository(User).query(`TRUNCATE TABLE "user" RESTART IDENTITY;`)
        res.status(200).json({message : `delete all users`});
    })

