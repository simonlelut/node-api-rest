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
    describe('/GET/:id user', () => {
        it('it should GET a user by the given id', (done) => {
            let user = new User();
            user.name = "testUser";
            getConnection().getRepository(User).save(user).then((user) => {
                chai.request(server)
                .get('/users/' + user.id)
                .end((err, res) => {
                    if(err) console.log(err)
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