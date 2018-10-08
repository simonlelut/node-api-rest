import Joi from 'joi';

export const querySchemaGeneric = Joi.object().keys({
    range: Joi
        .string()
        .regex(/\d*-\d*$/) // range=number-number
        .error(new Error("range invalid")),
    sort: Joi
        .string()
        .regex(/\b[^\d\W]+\b/),
    desc: Joi
        .string()
        .regex(/\b[^\d\W]+\b/)
});