process.env.NODE_ENV = 'test';

import {User} from "../app/entity/User";
import {getConnection} from "typeorm";
import { Application } from "../app/server";
import faker from 'faker';

// setup tests
faker.locale = "fr";
let chai = require('chai'), 
chaiHttp = require('chai-http');
chai.should();
chai.use(chaiHttp);
let config = require("../config/config.dist.json");
let server;
let connection;

before(async () => { 
    await Application.getApp(config).then(async serv => { 
       
        server = serv;
        connection = await getConnection();
    });
});


const addUsers = async (number) => {
    for(let i = 0; i < number; i++){
            
        let user = new User();
        user.name = faker.name.findName();
        await connection.getRepository(User).save(user).then();
    }
}

const deleteUsers = async () =>{
    connection.getRepository(User).delete({});
}

beforeEach( async () => { 
    await deleteUsers();
}); 

after(async () => {
    await deleteUsers();
    Application.stop();
});


//Our parent block
describe('User',  () => {
    
    it('it should get 5 users', (done) => {

        addUsers(5).then(() =>{

            chai.request(server)
            .get('/users')
            .end((err,res) => {

                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.length.should.be.eql(5);
                res.should.have.header('content-type', "application/json; charset=utf-8");
                res.should.have.header('Accept-Range', "50");
                //res.should.have.header('Link ', `<${config.uri}/users?range=20-40>; rel="next",<${config.uri}/users?range=30-50>; rel="last"`);
                done();
            });
        })
    });
        
    
   it('it should get 50 users', (done) => {

        addUsers(50).then(() => {
            chai.request(server)
            .get('/users?range=10-60')
            .end((err,res) => {

                res.should.have.status(206);
                res.body.should.be.a('array');
                res.body.length.should.be.eql(40);
                res.should.have.header('content-type', "application/json; charset=utf-8");
                res.should.have.header('Accept-Range', "50");
                res.should.have.header('Content-Range', "10-60/50");
                done();
            });
        });
    }) 

    it('it should get error 400, too big range', (done) => {

        addUsers(50).then(() => {
            chai.request(server)
            .get('/users?range=0-51')
            .end((err,res) => {

                res.should.have.status(400);
                res.body.should.be.eql({"reason": "Requested range not allowed"});
                res.should.have.header('Accept-Range', "50");
                done();
            });
        });
    }) 
    it('Add 20 users, Link with first 0-5, next 10-15, last 15-20', (done) => {

        addUsers(20).then(() => {
            chai.request(server)
            .get('/users?range=5-10')
            .end((err,res) => {

                res.should.have.status(206);
                res.body.should.be.a('array');
                res.body.length.should.be.eql(5);
                res.should.have.header('content-type', "application/json; charset=utf-8");
                res.should.have.header('Accept-Range', "50");
                res.should.have.header('Content-Range', "5-10/20");
                res.should.have.header('Link', `<${config.uri}/users?range=0-5>; rel="first",<${config.uri}/users?range=10-15>; rel="next",<${config.uri}/users?range=15-20>; rel="last"`);
                done();
            });
        });
    })
    it('it should get error 400, range start > end', (done) => {

        chai.request(server)
        .get('/users?range=200-51')
        .end((err,res) => {

            res.should.have.status(400);
            res.body.should.be.eql({"reason": "Requested range not allowed"});
            res.should.have.header('Accept-Range', "50");
            done();
        });
    }) 

    
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

