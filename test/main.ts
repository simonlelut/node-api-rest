process.env.NODE_ENV = 'test';

import {User} from "../app/entity/User";
import {getConnection} from "typeorm";
import { Application } from "../app/server";
import faker from 'faker';
import { Group } from "../app/entity/Group";

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

beforeEach( async () => { 
    await deleteUsers();
}); 

after(async () => {
    await deleteUsers();
    Application.stop();
});

const deleteUsers = async () =>{
    connection.getRepository(User).delete({});
}

//Our parent block
describe('User',  () => {
    
    it('get all fro 5 users', (done) => {

        User.addUsers(5).then(_ =>{

            chai.request(server)
            .get('/users')
            .end((err,res) => {
                res.should.have.status(200);
                res.body.meta.total_count.should.be.eql(5)
                res.body.meta.number_pages.should.be.eql(1)
                res.body.users.should.be.a("array")
                res.body.users.length.should.be.eql(5);
                res.should.have.header('content-type', "application/json; charset=utf-8");
                
                done();
            });
        })
    });
        
    
   it('get all fro 25 users', (done) => {

        User.addUsers(25).then(_ => {
            chai.request(server)
            .get(`/users?per_page=25`)
            .end((err,res) => {

                res.should.have.status(200);
                res.body.meta.total_count.should.be.eql(25)
                res.body.meta.number_pages.should.be.eql(1)
                res.body.users.should.be.a("array")
                res.body.users.length.should.be.eql(25);
                res.should.have.header('content-type', "application/json; charset=utf-8");
                done();
            });
        });
    }) 
    it('get all with 2 pages', (done) => {

        User.addUsers(6).then(_ => {
            chai.request(server)
            .get(`/users?per_page=3&page=2`)
            .end((err,res) => {

                res.should.have.status(206);
                res.body.meta.total_count.should.be.eql(6)
                res.body.meta.number_pages.should.be.eql(2)
                res.body.users.should.be.a("array")
                res.body.users.length.should.be.eql(3);
                res.should.have.header('content-type', "application/json; charset=utf-8");
                done();
            });
        });
    }) 
    
    it('get one', (done) => {
        
        User.addUsers(1).then(async _ => {

            connection.getRepository(User).findOne({relations: ["group"]})
                .then(user => {
                    user = user.getUser().user;
                    chai.request(server)    
                    .get(`/users/${user.id}`)
                    .set("Authorization", `Token ${user.token}`)
                    .end((err,res) => {
                        res.should.have.status(200);
                        res.body.user.id.should.be.eql(user.id)
                        res.should.have.header('content-type', "application/json; charset=utf-8");
                        done();
                    });
                })
        });
    }) 
    it('get one and no header', (done) => {
        
        User.addUsers(1).then(async _ => {

            connection.getRepository(User).findOne({relations: ["group"]})
                .then(user => {
                    user = user.getUser().user;
                    chai.request(server)    
                    .get(`/users/${user.id}`)
                    .end((err,res) => {
                        res.should.have.status(401);
                        done();
                    });
                })
        });
    }) 
    /*
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
    
    */

});

