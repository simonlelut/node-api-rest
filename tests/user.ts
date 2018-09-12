process.env.NODE_ENV = 'test';

import {User} from "../app/entity/User";
import {getConnection} from "typeorm";
import { Application } from "../app/util/application";

//Require the dev-dependencies
let chai = require('chai')
  , chaiHttp = require('chai-http');

let should = chai.should();

chai.use(chaiHttp);


//Our parent block
describe('User', () => {
    let server;
    let connection;

    beforeEach(done => { 

        connection.getRepository(User).delete({});
        done();
    }); 

    before(done => { 
        Application.getApp().then(async serv => { 
            server = serv;
            connection = await getConnection();
            done();
        }).catch(done);
    });

    /*
    * Test the /GET route
    */
    describe('/GET users', () => {
    it('it should GET all the users', (done) => {
        console.log()
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
   
});