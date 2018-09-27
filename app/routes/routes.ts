import express from 'express';
import UserRouter from './users/UserRouter'

const router = express();

//for swagger
import swaggerUi from 'swagger-ui-express';
import YAML from "yamljs";
const swaggerDocument = YAML.load('api/swagger/swagger.yaml');
router.use('/', swaggerUi.serve);
router.get('/', swaggerUi.setup(swaggerDocument));


router.use('/users', UserRouter);

router.all('*',(req,res) => {
    res.status(404).send({msg:"route not found"})
})

export default router;
