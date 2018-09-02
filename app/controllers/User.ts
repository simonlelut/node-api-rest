import {Request, Response, NextFunction} from 'express';
import {User} from "../entity/User";
import {getConnection} from "typeorm";

let user_find : User;

class UserController{

    /**
     * @param  {Request} req
     * @param  {Response} res
     * @param  {NextFunction} next
     */
    public getAll(req: Request, res: Response, next: NextFunction): void {

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
     * @param  {Request} req
     * @param  {Response} res
     * @param  {NextFunction} next
     */
    public get(req: Request, res: Response, next: NextFunction): void {
        
        res.status(200).json(user_find);
    }

    /**
     * @param  {Request} req
     * @param  {Response} res
     * @param  {NextFunction} next
     */
    public create(req: Request, res: Response, next: NextFunction): void {

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

    /**
     * @param  {Request} req
     * @param  {Response} res
     * @param  {NextFunction} next
     */
    public update(req: Request, res: Response, next: NextFunction): void {

        user_find.name = req.body.name;

        getConnection().getRepository(User).save(user_find)            
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
     * @param  {Request} req
     * @param  {Response} res
     * @param  {NextFunction} next
     */
    public delete(req: Request, res: Response, next: NextFunction): void {

        getConnection().getRepository(User).delete(user_find)            
        .then(() => {
            res.status(200).json({message : "User delete !"});
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
     * @param  {Request} req
     * @param  {Response} res
     * @param  {NextFunction} next
     * @param  {nNumber} id
     */
    userId(req: Request, res: Response, next: NextFunction, id: number): void {

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