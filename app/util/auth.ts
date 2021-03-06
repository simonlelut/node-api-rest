import jwt from 'express-jwt'

const getTokenFromHeaders = (req) => {
    const { headers: { authorization } } = req;
    if(authorization && authorization.split(' ')[0].toLowerCase() === 'token') {
      return authorization.split(' ')[1];
    }
    return null;
};

export const auth = {
  required: jwt({
    secret: 'secret',
    userProperty: 'payload',
    getToken: getTokenFromHeaders,
  }),
  optional: jwt({
    secret: 'secret',
    userProperty: 'payload',
    getToken: getTokenFromHeaders,
    credentialsRequired: false,
  }),
};