process.env.NODE_ENV = 'test';

import {User} from "../app/entity/User";
import {getConnection} from "typeorm";
import { Application } from "../app/server";
import faker from 'faker';
import async from "async";
import { doesNotReject } from "assert";

// sets locale to fr
faker.locale = "fr";

//Require the dev-dependencies
let chai = require('chai')
  , chaiHttp = require('chai-http');

let should = chai.should();

chai.use(chaiHttp);

let config = {"databaseConfig" : {
        "type": "postgres",
        "host": "localhost",
        "port": 5432,
        "username": "postgres",
        "password": "",
        "database": "test",
        "entities": ["app/entity/*.ts"],
        "synchronize": true,
        "logging" : false
    } }




//Our parent block
describe('User', () => {

    const addUsers = async (number) => {
        for(let i = 0; i < number; i++){
                
            let user = new User();
            user.name = faker.name.findName();
            await connection.getRepository(User).save(user).then();
        }
        
    }
    let server;
    let connection;

    beforeEach( (done) => { 
        connection.getRepository(User).delete({}).then(()=>{
            done();
        })
    }); 

    before(async () => { 
        
        return await Application.getApp(config).then(async serv => { 
            server = serv;
            connection = await getConnection();
        });
    });

    after(async () => {
        Application.stop();
    });

    /*
    * Test the /GET route
    */
    describe('/get Users', () => {
    it('it should get 5 users', (done) => {

        addUsers(6);
        chai.request(server)
            .get('/users')
            .end((err,res) => {

                res.should.have.status(206);
                res.body.should.be.a('array');
                res.body.length.should.be.eql(5);
                res.should.have.header('content-type', "application/json; charset=utf-8");
                res.should.have.header('Accept-Range', "50");
                done();
            });
        });
    });

     /*
    * Test the /GET route
    */
   describe('/get Users', () => {
    it('it should get all the users', (done) => {

        addUsers(60).then(() => {
            chai.request(server)
            .get('/users?range=10-60')
            .end((err,res) => {

                res.should.have.status(206);
                res.body.should.be.a('array');
                res.body.length.should.be.eql(5);
                res.should.have.header('content-type', "application/json; charset=utf-8");
                res.should.have.header('Accept-Range', "50");
                res.should.have.header('Content-Range', "5-10/50");
                done();
            });
        });
        })
        
    });

});