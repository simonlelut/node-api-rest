import {expect} from 'chai';
import {User} from "../app/entity/User";


describe('User', () =>{

    it("name equal to test", () =>{
        
        const user = new User();
        user.name = "test"
        expect(user.name).equal("test")
    })

})