import {Request, Response, NextFunction, json} from 'express';
import {User} from "../entity/User";
import {getConnection, Like} from "typeorm";
import util from "../util/Util";

/**
 * 
 */
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
                    .json({meta: util.getMeta(data.query), content : User.getUsers(data.results)})
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
    public get = (_req: Request, res: Response): void => {
        
        res.status(200).json(User.getUser(this.userFind));
    }

    /**
     * @param  {Request} req
     * @param  {Response} res
     * @param  {NextFunction} next
     */
    public create = (req: Request, res: Response, next: NextFunction): void => {

        let user = User.createUser(req);

        getConnection().getRepository(User).save(user)            
        .then(() => {
            res.status(201).json(User.getUser(user));
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

        this.userFind = User.updateUser(this.userFind, req);
        
        getConnection().getRepository(User).save(this.userFind)            
        .then((data) => {
            res.status(200).json(User.getUser(data));
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
    public delete = (req: Request, res: Response, next: NextFunction): void => {

        getConnection().getRepository(User).delete(this.userFind)            
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
     * @param  {nNumber} id
     */
    public userId = (_req: Request, res: Response, next: NextFunction, id: number): void  => {

        getConnection().getRepository(User).findOne({id: id})
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