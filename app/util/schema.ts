import Joi from 'joi';

export const querySchemaGeneric = Joi.object().keys({
    page: Joi
        .string()
        .regex(/[1-9][1-9]*/) // number
        .error(new Error("page invalid")),
    per_page: Joi
        .string()
        .regex(/[1-9][1-9]*/) // number
        .error(new Error("per_page invalid")),
    sort: Joi
        .string(),
    desc: Joi
        .string(),
    
});