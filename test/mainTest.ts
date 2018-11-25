process.env.NODE_ENV = 'test';

import { user } from './User/userTest'

import {getConnection} from "typeorm";
import { Application } from "../app/server";
let config = require("../config/config.dist.json");

export let server;
export let connection;

before(async () => { 
    await Application.getApp(config).then(async serv => { 
       
        server = serv;
        connection = await getConnection();
    });
});


after(async () => {
    Application.stop();
});

//Our parent block
describe('User get test', user );

