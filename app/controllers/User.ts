import { Request, Response, NextFunction } from 'express';

import { getRepository } from "typeorm";
import util from "../util/Util";
import passport from 'passport';
import { User } from '../entity/User';



class UserController{

    private userFind : User;

    /**
     * @param  {Request} req
     * @param  {Response} res
     * @param  {NextFunction} next
     */
    public getAll = async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
        
        await util.getQuery(res,req, User)
            .then((data) => {

                res.status(data.results.length === data.query.countAll ? 200 : 206)
                        .json({meta: util.getMeta(data.query), users : User.getUsers(data.results)})
            })
            .catch((error: Error) => {
                next(error);
            });
    }

    /**
     * @param  {Request} req
     * @param  {Response} res
     * @param  {NextFunction} next
     */
    public get = (_req: Request, res: Response): Response => {

        return res.status(200).json(this.userFind.getUser());
    }

    

    /**
     * @param  {Request} req
     * @param  {Response} res
     * @param  {NextFunction} next
     */
    public create = (req: Request, res: Response, next: NextFunction): void => {

        let user = User.createUser(req);

        getRepository(User).save(user)            
            .then((user: User) => {
                res.status(201).json(user.getUser());
            })
            .catch((error: Error) => {
                next(error);
            });
    }

    /**
     * @param  {Request} req
     * @param  {Response} res
     * @param  {NextFunction} next
     */
    public put = (req: Request, res: Response, next: NextFunction): void => {

       
        this.userFind.updateUser(req.body.user);
        
        getRepository(User).save(this.userFind)            
            .then((user : User) => {
                res.status(200).json(user.getUser());
            })
            .catch((error: Error) => {
                next(error);
            });
    }

    /**
     * @param  {Request} req
     * @param  {Response} res
     * @param  {NextFunction} next
     */
    public delete = (_req: Request, res: Response, next: NextFunction): void => {

        getRepository(User).delete(this.userFind)            
            .then(() => {
                res.status(200).json({message : "User delete !"});
            })
            .catch((error: Error) => {
                next(error);
            });
    }


    /**
     * @param  {Request} req
     * @param  {Response} res
     * @param  {NextFunction} next
     */
    public login = async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => 
    {

        return passport.authenticate('local', { session: false }, (err, passportUser: User, info) => {
           
            if(err) 
                return next(err);
          
            if(passportUser) 
                return res.json(passportUser.getUser());
          
            return res.status(400).json(info);

        })(req, res, next);

    }


    /**
     * @param  {Request} req
     * @param  {Response} res
     * @param  {NextFunction} next
     */
    public current = (req, res: Response, next: NextFunction): void | Response => {

        getRepository(User).findOne({id: req.payload.id})     
            .then((user : User) => {

                if(!user)
                    res.sendStatus(400);
                
                res.status(201).json(user.getUser());
            })
            .catch((error: Error) => {
                next(error);
            });
    }

    /**
     * @param  {Request} req
     * @param  {Response} res
     * @param  {NextFunction} next
     * @param  {nNumber} id
     */
    public userId = (_req: Request, res: Response, next: NextFunction, id: number): void  => {

        getRepository(User).findOne({id: id})
            .then((user) => {

                if(!user)
                    return res.status(404).json("this User doesn't exist !");

                    this.userFind  = user;
                next();
            })
            .catch((error: Error) => {
                next(error);
            });

    }
}

export default new UserController();