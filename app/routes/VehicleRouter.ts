import express from 'express';
import VehicleController from '../controllers/vehicle';
import {Vehicle} from "../entity/Vehicle";
import {getConnection} from "typeorm";

/*
    /vehicles
*/
export default express()

    .get('/',VehicleController.getAll)
    .get('/:vehicleId', VehicleController.get)
    .post('/', VehicleController.create)
    
    .put('/:vehicleId', VehicleController.put)
    .delete('/:vehicleId', VehicleController.delete)

    .param("vehicleId", VehicleController.vehicleId)
    .get('/populate/:nbPopulate', async (req,res) =>{
        await Vehicle.addVehicles(Number(req.params.nbPopulate));
        res.status(200).json({message : `add ${req.params.nbPopulate} vehicles`});
        
    })
    .get('/test/delete', async (req,res) =>{
        await getConnection().getRepository(Vehicle).query(`TRUNCATE TABLE vehicle RESTART IDENTITY;`)
        res.status(200).json({message : `delete all vehicles`});
    })

