import { checkSchema  } from 'express-validator/check';



export const bodyValidator =  checkSchema({

    "user.password": {
        in: "body",
        isLength: {
            errorMessage: 'Password should be at least 7 chars long',
            // Multiple options would be expressed as an array
            options: { min: 7 }
        }
    },
    "user.email" : {
        in: "body",
        isEmail: true
    },
    "user.name": {
        in: 'body',
        isString: true
    },
    "user.lastname": {
        in: 'body',
        isString: true
    },
    "user.profile_image": {
        in: 'body',
        optional: true,
        isURL: true
    },
})

export const login = checkSchema({

    password: {
        in: "body",
        isLength: {
            errorMessage: 'Password should be at least 7 chars long',
            // Multiple options would be expressed as an array
            options: { min: 7 }
        }
    },
    email : {
        in: "body",
        isEmail: true
    }
})