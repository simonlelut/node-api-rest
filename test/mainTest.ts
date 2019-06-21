process.env.NODE_ENV = 'test';

import { user } from './User/userTest'

import {getConnection} from "typeorm";
import { Application } from "../app/server";

export let server;
export let connection;

before(async () => { 
    /*
    await Application.getApp().then(async serv => { 
       
        server = serv;
        connection = await getConnection();
    });
    */
});


after(async () => {
    //Application.stop();
});

//Our parent block
//describe('User get test', user );