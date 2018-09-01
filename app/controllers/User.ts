import * as express from 'express';
import {User} from "../entity/User";
import {getConnection} from "typeorm";

let user_find : User;

class UserController{

    /**
     * @param  {express.Request} req
     * @param  {express.Response} res
     * @param  {express.NextFunction} next
     */
    public getUsers(req: express.Request, res: express.Response, next: express.NextFunction): void {

        //console.log(req.app.get('config')) //getConfig

        getConnection().getRepository(User)           
            .find()
            .then((data) => {
                res.status(200).json(data);
            })
            .catch((error: Error) => {
                res.status(500).json({
                    error: error.message,
                    errorStack: error.stack
                });
                next(error);
            });
            
    }

    /**
     * @param  {express.Request} req
     * @param  {express.Response} res
     * @param  {express.NextFunction} next
     */
    public createUser(req: express.Request, res: express.Response, next: express.NextFunction): void {

        const user = new User();
        user.name = req.body.name;

        getConnection().getRepository(User).save(user)            
        .then((data) => {
            res.status(200).json(data);
        })
        .catch((error: Error) => {
            res.status(500).json({
                error: error.message,
                errorStack: error.stack
            });
            next(error);
        });
    }

    userId(req: express.Request, res: express.Response, next: express.NextFunction, id: number): void {

        getConnection().getRepository(User).findOne({id: id})
            .then((user) => {

                if(!user)
                    return res.status(404).json("this User doesn't exist !");

                user_find  = user;
                next();
            })
            .catch((error: Error) => {
                res.status(500).json({
                    error: error.message,
                    errorStack: error.stack
                });
                res.status(404).json("this User doesn't exist !");
                next(error);
            });

    }
}

export default new UserController();