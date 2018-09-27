import express from 'express';
import UserController from '../controllers/User';

/*
    /users
*/
export default express()

    .get('/', UserController.getAll)
    .get('/:userId', UserController.get)
    .post('/', UserController.create)
    .put('/:userId', UserController.update)
    .delete('/:userId', UserController.delete)

    .param("userId", UserController.userId)