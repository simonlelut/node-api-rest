import {Request, Response, NextFunction} from 'express';
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
        
        await util.getQuery(req.query, res,req, User)
            .then((data) => {
                if(!data)
                    return ;

                if(data.results.length === data.query.countAll)
                    res.status(200).json(User.getUsers(data.results));
                else{
                    //set header for pagination
                    util.setPagination(data.query, req, res);

                    //result a part of users
                    res.status(206).json(User.getUsers(data.results));
                }
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
    public get = (req: Request, res: Response, next: NextFunction): void => {
        
        res.status(200).json(User.getUser(this.userFind));
    }

    /**
     * @param  {Request} req
     * @param  {Response} res
     * @param  {NextFunction} next
     */
    public create = (req: Request, res: Response, next: NextFunction): void => {

        let user = new User();
        user = req.body;

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

        this.userFind = req.body;

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
    public patch = (req: Request, res: Response, next: NextFunction): void => {

        this.userFind.name = req.body.name;

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