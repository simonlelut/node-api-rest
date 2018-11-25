import {User} from "../../app/entity/User";
import {userGet} from './userGetTest';
import {userUpdate} from './userUpdateTest';
import { connection } from "../mainTest";


beforeEach( async () => { 
    await deleteUsers();
}); 

const deleteUsers = () =>{
    connection.getRepository(User).delete({});
}

export const user =  () => {
    describe('get user', userGet);
    describe('update', userUpdate);
}
