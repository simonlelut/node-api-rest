import {Request, Response, NextFunction, json} from 'express';
import {Vehicle} from "../entity/Vehicle";
import {getConnection, Like} from "typeorm";
import util from "../util/Util";

/**
 * 
 */
class VehicleController{

    private vehicleFind : Vehicle;
    
    /**
     * @param  {Request} req
     * @param  {Response} res
     * @param  {NextFunction} next
     */
    public getAll = async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
        
        await util.getQuery(req.query, res,req, Vehicle)
            .then((data) => {

                if(data.results.length === data.query.countAll)
                    res.status(200).json(Vehicle.getVehicles(data.results));
                else{
                    //set header for pagination
                    util.setPagination(data.query, req, res);

                    //result a part of vehicles
                    res.status(206).json(Vehicle.getVehicles(data.results));
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
    public get = (_req: Request, res: Response): void => {
        
        res.status(200).json(Vehicle.getVehicle(this.vehicleFind));
    }

    /**
     * @param  {Request} req
     * @param  {Response} res
     * @param  {NextFunction} next
     */
    public create = (req: Request, res: Response, next: NextFunction): void => {
        
        let vehicle = Vehicle.createVehicle(req);

        getConnection().getRepository(Vehicle).save(vehicle)            
        .then(() => {
            res.status(201).json(Vehicle.getVehicle(vehicle));
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
        

        this.vehicleFind = Vehicle.updateVehicle(this.vehicleFind, req);

        getConnection().getRepository(Vehicle).save(this.vehicleFind)            
        .then((data) => {
            res.status(200).json(Vehicle.getVehicle(data));
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

        getConnection().getRepository(Vehicle).delete(this.vehicleFind.id)
        .then(() => {
            res.status(200).json({message : "Vehicle delete !"});
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
    public vehicleId = (_req: Request, res: Response, next: NextFunction, id: number): void  => {

        getConnection().getRepository(Vehicle).findOne({id: id})
            .then((vehicle) => {

                if(!vehicle)
                    return res.status(404).json("this Vehicle doesn't exist !");

                    this.vehicleFind  = vehicle;
                next();
            })
            .catch((error: Error) => {
                next(error);
            });

    }
}

export default new VehicleController();