import express from 'express';
import UserRouter from './UserRouter'
import Joi from 'joi';
const validator = require('express-joi-validation')({passError: true})

const router = express();

//for swagger
import swaggerUi from 'swagger-ui-express';
import YAML from "yamljs";
const swaggerDocument = YAML.load('api/swagger/swagger.yaml');
router.use('/', swaggerUi.serve);
router.get('/', swaggerUi.setup(swaggerDocument));

const querySchema = Joi.object({
    range: Joi
        .string()
        .regex(/\d*-\d*$/) // range=number-number
        .error(new Error("range invalid")),
    
})

router.use('/users',validator.query(querySchema), UserRouter);

router.all('*',(req,res) => {
    res.status(404).send({msg:"route not found"})
})

router.use((err, req, res, next) => {

    if (err.error.message) {
        res.status(400).json({
          message: err.error.message,
        });
    } else {
        next(err)
    }
  });

export default router;
