import debug from 'debug';
import http from 'http';
import express from 'express';
import router from './routes/routes';
import bodyParser from 'body-parser';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import "reflect-metadata";
import morgan from 'morgan';
import {createConnection} from "typeorm";
import responseTime  from "response-time";

//for typescript
debug('ts-express:server');

export class Application {

    static server: http.Server; 

    public static async getApp(config? : any): Promise<express.Express> {

        //if no config set use default 
        config =  config ? config : require("../config/config.json");

        //variablesx
        const port:number = 3000;
        const app: express.Express = express();

        //global variables
        app.set('port', port);
        app.set("config",config)

        // middleware
        app.use(bodyParser.urlencoded({ extended: false }));
        app.use(bodyParser.json());
        app.use(cookieParser());
        app.use(compression());
        app.use(helmet());
        app.use(cors());
        app.use(responseTime())

        if(process.env.NODE_ENV !== "test"){
            app.use(morgan('combined'));
            await createConnection(config.databaseConfig)
            .catch(e =>{
                console.log(e);
                process.exit(1);
            });
        } else
            await createConnection(config.databaseTest)
            .catch(e =>{
                console.log(e);
                process.exit(1);
            });    

        // cors
        app.use((req, res, next) => {
            res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS ');
            res.header(
                'Access-Control-Allow-Headers',
                'Origin, X-Requested-With,' +
                ' Content-Type, Accept,' +
                ' Authorization,' +
                ' Access-Control-Allow-Credentials'
            );
            res.header('Access-Control-Allow-Credentials', 'true');
            next();
        });

        //Routes
        app.use(router);

        this.server= http.createServer(app);

        var io = require('socket.io')(this.server);

        // server handlers
        this.server.on('error', (error) => console.error(error));
         
        console.info("database connection set");

        // server listen
        await this.server.listen(port);
        console.log(`Server running on port: ${port}`);

        io.emit('server', "everyone");
        io.on('connection',  (socket) =>{
            socket.emit('server', "Bien souscris au socket !");

            socket.on('event1', (data) =>{
              console.log(data);
            });

            socket.on('event2', (data) =>{
                console.log(data)
            })
          });

        return app;
    }
    
    public static stop() {
        this.server.close();
    }
}

if(process.env.NODE_ENV !== "test")
    Application.getApp();
    