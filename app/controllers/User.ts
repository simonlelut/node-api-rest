import { Request, Response, NextFunction } from 'express';

import { getRepository } from "typeorm";
import util from "../util/Util";
import passport from 'passport';
import { User } from '../entity/User';
import { validationResult } from 'express-validator/check';


class UserController{

    private userFind : User;

    /**
     * @param  {Request} req
     * @param  {Response} res
     * @param  {NextFunction} next
     */
    public getAll = async (req: Request, res: Response, next: NextFunction) => {

        let result = await util.getQuery(res,req)

        let [users, count] = await getRepository(User)
            .createQueryBuilder("user")
            .leftJoinAndSelect("user.group", "group")
            .where(result.filter)
            .skip(result.skip)
            .take(result.per_page)
            .orderBy(result.order)
            .getManyAndCount();

        res.status(users.length === count ? 200 : 206)
                .json({meta: util.getMeta(result, count), users : User.getUsers(users)})
           
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
    public create = async (req: Request, res: Response, next: NextFunction) => {

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
          return res.status(422).json({ errors: errors.array() });
        }

        let user = await User.createUser(req.body.user);

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
    public put = (req: Request, res: Response, next: NextFunction) => {

        
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
    public login = (req: Request, res: Response, next: NextFunction): Promise<void | Response> => 
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
    public current = (req: any, res: Response, next: NextFunction): void | Response => {

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

        getRepository(User).findOne(id, {relations: ["group"]})
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