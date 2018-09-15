process.env.NODE_ENV = 'test';

import {User} from "../app/entity/User";
import {getConnection} from "typeorm";
import { Application } from "../app/server";

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
    let server;
    let connection;

    beforeEach(done => { 
        connection.getRepository(User).delete({});
        done();
    }); 

    before(done => { 
        
        Application.getApp(config).then(async serv => { 
            server = serv;
            connection = await getConnection();
            done();
        }).catch(done);
    });

    /*
    * Test the /GET route
    */
    describe('/get Users', () => {
    it('it should get all the users', (done) => {
        
        chai.request(server)
            .get('/users')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.length.should.be.eql(0);
            done();
            });
        });
    });

     describe('/get/:idUser', () => {
        it('it should get a user by id', (done) => {

            let user = new User();
            user.name = "testUser";

            connection.getRepository(User).save(user).then((user) => {
                chai.request(server)
                .get('/users/' + user.id)
                .end((err, res) => {

                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('name');
                        res.body.should.have.property('id').eql(user.id);
                    done();
                });
            });
        });
    });
   
});