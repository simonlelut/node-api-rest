import Joi from 'joi';

export const querySchemaGeneric = Joi.object().keys({
    range: Joi
        .string()
        .regex(/\d*-\d*$/) // range=number-number
        .error(new Error("range invalid")),
    
});