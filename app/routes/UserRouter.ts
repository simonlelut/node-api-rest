import express from 'express';
import UserController from '../controllers/User';
import {User} from "../entity/User";
import faker from 'faker';
import {getConnection} from "typeorm";

/*
    /users
*/
const addUsers = async (number) => {
    for(let i = 0; i < number; i++){
            
        let user = new User();
        user.name = faker.name.findName();
        await getConnection().getRepository(User).save(user).then();
    }
}
export default express()

    .get('/', UserController.getAll)
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

