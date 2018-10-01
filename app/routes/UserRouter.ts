import express from 'express';
import UserController from '../controllers/User';

/*
    /users
*/
export default express()

    .get('/', UserController.getAll)
    .get('/:userId', UserController.get)
    .post('/', UserController.create)
    .patch('/:userId', UserController.patch)
    .put('/:userId', UserController.put)
    .delete('/:userId', UserController.delete)

    .param("userId", UserController.userId)