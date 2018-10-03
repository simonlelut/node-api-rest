import {Request, Response, NextFunction} from 'express';
import {User} from "../entity/User";
import {getConnection} from "typeorm";
import async from "async";
import util from "../util/Util";

/**
 * 
 */
class UserController{

    private userFind : User;

    private getUser = (user : User) => {
        return {
            "id"    : user.id,
            "name"  : user.name
        }
    }

    private getUsers = (users) => {
        let result = [];
        async.forEachOf(users, (user)=>{
            result.push(this.getUser(user as User))
        })
        return result;
    }

    /**
     * @param  {Request} req
     * @param  {Response} res
     * @param  {NextFunction} next
     */
    public getAll = async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
        
        let query: any = await util.getQuery(req.query.range, res,req, User);
        
        if(!query)
            return ;
        
        getConnection().getRepository(User)           
            .find({
                skip : query.start,
                take : query.range
            })
            .then((data) => {

                if(data.length == query.countAll)
                    res.status(200).json(this.getUsers(data));
                else{
                    //set header for pagination
                    util.setPagination(query, req, res)

                    //result a part of users
                    res.status(206).json(this.getUsers(data));
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
        
        res.status(200).json(this.getUser(this.userFind));
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
            res.status(201).json(this.getUser(user));
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
            res.status(200).json(this.getUser(data));
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
            res.status(200).json(this.getUser(data));
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