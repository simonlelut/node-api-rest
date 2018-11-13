import express from 'express';
import UserRouter from './UserRouter'
import VehicleRouter from './VehicleRouter'

const router = express();

//for swagger
import swaggerUi from 'swagger-ui-express';
import YAML from "yamljs";
const swaggerDocument = YAML.load('api/swagger/swagger.yaml');
router.use('/', swaggerUi.serve);
router.get('/', swaggerUi.setup(swaggerDocument));

router.get('/config', (req,res) =>{
    res.status(200).json(req.app.get('config').databaseConfig.host)
});
router.use('/users', UserRouter);
router.use('/vehicles', VehicleRouter);

router.all('*',(req,res) => {
    res.status(404).send({msg:"route not found"})
})

router.use((err, _req, _res, next) => {
    next(err)
});


export default router;
