import debug from "debug";
import http from "http";
import express from "express";
import router from "./routes/routes";
import bodyParser from "body-parser";
import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import "reflect-metadata";
import morgan from "morgan";
import { createConnection } from "typeorm";
import responseTime from "response-time";
import session from "express-session";
import passport from "passport";
import { strategy } from "./util/middleware";
import { Group, GroupLevel } from "./entity/Group";

import AWS from "aws-sdk";
import { promises } from "fs";
//for typescript
debug("ts-express:server");

export class Application {
  static server: http.Server;

  public static async getApp(config?: any) {
    //if no config set use default
    config = config ? config : require("../config/config.json");
    
    //variables
    const port: number = 3000;
    const app = express();
    let connect = null;
    let entities = [`${__dirname}\\entity\\*`];

    //global variables
    app.set("port", port);
    app.set("config", config);

    // middleware
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    app.use(cookieParser());
    app.use(compression());
    app.use(helmet());
    app.use(cors());
    app.use(responseTime()),
    app.use(
      session({
        secret: "passport-tutorial",
        cookie: { maxAge: 60000 },
        resave: false,
        saveUninitialized: false
      })
    );
    passport.use(strategy);

      // cors
      app.use((req, res, next) => {
        res.header(
          "Access-Control-Allow-Methods",
          "GET, POST, PUT, DELETE, OPTIONS "
        );
        res.header(
          "Access-Control-Allow-Headers",
          "Origin, X-Requested-With,Content-Type, Accept,Authorization,Access-Control-Allow-Credentials"
        );
        res.header("Access-Control-Allow-Credentials", "true");
        res.header(
          "Access-Control-Expose-Headers",
          "Origin, X-Requested-With,Content-Type, Accept,Authorization,Access-Control-Allow-Credentials,Content-Range,Link,Number-Pages"
        );

        next();
      });
      
    if (process.env.NODE_ENV !== "test") {
      
      app.use(morgan("combined"));
      config.databaseConfig.entities = entities;
      
      connect = createConnection(config.databaseConfig);
      
    }else{
      config.databaseTest.entities = entities;
      
      connect = createConnection(config.databaseTest);
    }

    return connect.then(async connection => {

        console.info("database connection set");

        let count = await connection.getRepository(Group).count()
           
        if(count === 0){
            const admin = new Group("admin",GroupLevel.ADMIN);
            const user = new Group("user",GroupLevel.USER);
            
            await connection.getRepository(Group).insert(admin);
            await connection.getRepository(Group).insert(user);
        }
        /* AWS
        var albumBucketName = "nodeapirest";
        var bucketRegion = "us-east-1";
        var IdentityPoolId = "us-east-1:59d1301e-8942-4a78-af30-9351c5c64a0f";

        AWS.config.update({
          region: bucketRegion,
          credentials: new AWS.CognitoIdentityCredentials({
            IdentityPoolId: IdentityPoolId
          })
        });

        app.use(
          "/s3",
          require("react-s3-uploader/s3router")({
            bucket: albumBucketName,
            region: "eu-west-3",
            signatureVersion: "v4",
            ACL: "private",
            uniquePrefix: true // (4.0.2 and above) default is true, setting the attribute to false preserves the original filename in S3
            //getFileKeyDir: function() { return "/images/"; }
          })
        );
          */
        //Routes
        app.use(router);

        this.server = http.createServer(app);

        // server handlers
        this.server.on("error", error => console.error(error));

        // server listen
        await this.server.listen(port);
        console.log(`Server running on port: ${port}`);
        
        return app;
    })
    .catch(e => {
      
      console.log(e);
      process.exit(1);
    });
  }

  public static stop() {
    this.server.close();
  }
}

if (process.env.NODE_ENV !== "test") Application.getApp();
