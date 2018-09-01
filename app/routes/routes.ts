import * as express from 'express';
import UserRouter from './users/UserRouter'


const router = express();


router.get('/',(req,res) => {
    res.send({msg:"Welcome to my API ! "})
})


router.use('/users', UserRouter);





router.all('*',(req,res) => {
    res.status(404).send({msg:"route not found"})
})

export default router;
