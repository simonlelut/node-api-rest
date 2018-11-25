import {User} from "../../app/entity/User";
import faker from 'faker';
import { connection, server } from "../mainTest";
// setup tests
faker.locale = "fr";
let chai = require('chai'), 
chaiHttp = require('chai-http');
chai.should();
chai.use(chaiHttp);


export const userUpdate = () => {

    it('update ', (done) => {
        
        User.addUsers(1).then(async _ => {

            connection.getRepository(User).findOne({relations: ["group"]})
                .then(user => {
                    user = user.getUser().user;

                    chai.request(server)    
                        .put(`/users/${user.id}`)
                        .set("Authorization", `Token ${user.token}`)
                        .send({
                            user: {
                                lastname : "pierre"
                            }
                        })
                        .end((err,res) => {

                            res.should.have.status(200);
                            res.body.user.id.should.be.eql(user.id)
                            res.body.user.lastname.should.be.eql("pierre")
                            res.should.have.header('content-type', "application/json; charset=utf-8");
                            done();
                        });
                })
        });
    }) 
}