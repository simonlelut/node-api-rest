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

    private defaultRange = 5;

    private defaultStart = 0;

    private acceptRange = 50;

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

        //console.log(req.app.get('config')) //getConfig
        let query = null;

        let countAll = await getConnection().getRepository(User).count();

        res.setHeader("Accept-Range", `${this.acceptRange}`);

        try{
            if(req.query.range)
                query = util.getQuery(req.query.range, this.acceptRange, res, countAll);
        }
        catch(error){
            return next(error);
        };

        
        let start: number = query ? query.start : this.defaultStart;
        let range: number = query ? query.range : this.defaultRange;
        let end : number = query ? query.end : this.acceptRange;

        getConnection().getRepository(User)           
            .find({
                skip : start,
                take : range
            })
            .then((data) => {

                if(range >= countAll)
                    res.status(200).json(this.getUsers(data));
                else{

                    //set header for pagination
                    if (query)
                        util.setPagination(end,start, range,countAll,req,res)

                    //result a part of users
                    res.status(206).json(this.getUsers(data));
                }
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
    public put = (req: Request, res: Response, next: NextFunction): void => {

        this.userFind = req.body;

        getConnection().getRepository(User).save(this.userFind)            
        .then((data) => {
            res.status(200).json(this.getUser(data));
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
    public patch = (req: Request, res: Response, next: NextFunction): void => {

        this.userFind.name = req.body.name;

        getConnection().getRepository(User).save(this.userFind)            
        .then((data) => {
            res.status(200).json(this.getUser(data));
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
    public delete = (req: Request, res: Response, next: NextFunction): void => {

        getConnection().getRepository(User).delete(this.userFind)            
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
    public userId = (_req: Request, res: Response, next: NextFunction, id: number): void  => {

        getConnection().getRepository(User).findOne({id: id})
            .then((user) => {

                if(!user)
                    return res.status(404).json("this User doesn't exist !");

                    this.userFind  = user;
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