import express from 'express';
import UserController from '../controllers/User';
import {User} from "../entity/User";
import {getConnection} from "typeorm";
const validator = require('express-joi-validation')({passError: true})
import path  from "path";
import multerS3  from "multer-s3";
import multer  from "multer";
import aws  from "aws-sdk";
const s3 = new aws.S3();


const profileImage = multer({
    storage: multerS3({
      s3: s3,
      bucket: 'nodeapirest',
      acl: 'public-read',
      contentType: multerS3.AUTO_CONTENT_TYPE,
      metadata: function (req, file, cb) {
        cb(null, {fieldName: file.fieldname});
      },
      key: function (req, file, cb) {
        cb(null,  Date.now().toString() + "-"  + file.originalname)
      }
    }),
    limits:{ fileSize: 1000000 }, // In bytes: 2000000 bytes = 2 MB
    fileFilter: function ( req, file, cb ) {
        
        // Allowed ext
        const filetypes = /jpeg|jpg|png|gif/;
        // Check ext
        const extname = filetypes.test( path.extname( file.originalname ).toLowerCase());
        // Check mime
        const mimetype = filetypes.test( file.mimetype );
        if( mimetype && extname )
            return cb( null, true );
          
        cb(new Error('Error: Images Only!'), false);
    }
}).single('profileImage')


/*
    /users
*/
export default express()

    .get('/', validator.query(User.querySchema),UserController.getAll)
    .post('/image', profileImage,  (req : Express.Request, res) => {
        res.json({ message: 'Successfully uploaded  profile image !', file : req.file.location })
    })
    .get('/:userId', UserController.get)
    .post('/', profileImage, UserController.create)
    
    .put('/:userId',profileImage, UserController.put)
    .delete('/:userId', UserController.delete)

    .param("userId", UserController.userId)
    .get('/populate/:nbPopulate', async (req,res) =>{
        await User.addUsers(Number(req.params.nbPopulate));
        res.status(200).json({message : `add ${req.params.nbPopulate} users`});
        
    })
    .get('/test/delete', async (req,res) =>{
        await getConnection().getRepository(User).query(`TRUNCATE TABLE "user" RESTART IDENTITY;`)
        res.status(200).json({message : `delete all users`});
    })

