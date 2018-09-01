import * as express from 'express';
import UserController from '../../controllers/User';

/*
    /users
*/
export default express()

    .post('/', UserController.createUser)

    .get('/', UserController.getUsers)



    .param("userId", UserController.userId)

