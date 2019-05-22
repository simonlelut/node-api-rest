import * as bodyParser from 'body-parser';
import { User } from './User';
import { Request } from 'express';
import {Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne} from "typeorm";
import faker from 'faker';
import {getConnection} from "typeorm";
import moment from "moment";
faker.locale = "fr";

@Entity()
export class Vehicle {

    @PrimaryGeneratedColumn()
    id?: number;


    @Column({
        nullable: false,
        enum: ["voiture", "moto"]
    })
    type?: string;

    @Column({
        length: 100,
        nullable: false
    })
    modele?: string;

    @CreateDateColumn()
    created_at!: Date;

    @UpdateDateColumn()
    last_update!: Date;

    @Column({
        enum: [ "manuelle", "automatique"],
        nullable: false
    })
    boite_vitesse! : string;

    @Column({
        nullable: false
    })
    immatriculation!: string;

    @Column({
        enum: ["essence", "diesel"],
        nullable : false
    })
    type_moteur?: string;

    @Column({
        nullable : true
    })
    couleur?: string;

    @Column({
        nullable: false,
    })
    year_vehicle? : number

    @Column({
        nullable: false,
    })
    kilometrage!: number;

    @Column({
        nullable: true
    })
    image!: string;

    @ManyToOne(type => User, user => user.vehicles)
    user: User

    static addVehicles = async (number: Number) => {

        let vehicles = Array(number)
            .fill(null)
            .map( _ =>{
                let vehicle  = new Vehicle();
                
                vehicle.type = "voiture";
                vehicle.modele = faker.lorem.word();
                vehicle.boite_vitesse = "manuelle";
                vehicle.immatriculation = faker.helpers.replaceSymbols('???') + "-" + faker.random.alphaNumeric(3).toUpperCase() + "-" + faker.helpers.replaceSymbols('???');
                vehicle.type_moteur = "diesel";
                vehicle.couleur = faker.commerce.color();
                vehicle.year_vehicle = Number(moment(faker.date.past(null,'2016')).format("YYYY").toString()) - faker.random.number(10);
                vehicle.kilometrage = faker.random.number({min:0});

                return vehicle;
            })
        
        await getConnection().getRepository(Vehicle).save(vehicles, { chunk: 1000 })
    }

    static getVehicle = (vehicle : Vehicle) => {
        let data = {
            "id"                : vehicle.id,
            "type_vehicule"     : vehicle.type,
            "modele"            : vehicle.modele,
            "boite_vitesse"     : vehicle.boite_vitesse,
            "immatriculation"   : vehicle.immatriculation,
            "type_moteur"       : vehicle.type_moteur,
            "couleur"           : vehicle.couleur,
            "annee"             : vehicle.year_vehicle,
            "kilometrage"       : vehicle.kilometrage,
            "image"             : vehicle.image
        };
        
        return data
    }

    static getVehicles = (vehicles) => {
        return vehicles.map(vehicle => {
            return Vehicle.getVehicle(vehicle);
        });
    }

    static createVehicle = (req :Request): Vehicle => {
        let vehicle = new Vehicle();
        vehicle.id = req.body.id ? req.body.id : undefined;
        vehicle.type = req.body.typeVehicle;
        vehicle.modele = req.body.modele;
        vehicle.boite_vitesse = req.body.boiteVitesse;
        vehicle.immatriculation = req.body.immatriculation;
        vehicle.type_moteur = req.body.typeMoteur;
        vehicle.couleur =  req.body.couleur;
        vehicle.year_vehicle = req.body.annee
        vehicle.kilometrage = req.body.kilometrage;
        vehicle.user = req.payload.id;
        vehicle.image = req.body.image;
        return vehicle;
    }

    static updateVehicle = (vehicle: Vehicle,req : Request): Vehicle => {
        
        vehicle.type = req.body.typeVehicle;
        vehicle.modele = req.body.modele;
        vehicle.boite_vitesse = req.body.boiteVitesse;
        vehicle.immatriculation = req.body.immatriculation;
        vehicle.type_moteur = req.body.typeMoteur;
        vehicle.couleur =  req.body.couleur;
        vehicle.year_vehicle = req.body.annee
        vehicle.kilometrage = req.body.kilometrage;

        return vehicle;
    }
    
}