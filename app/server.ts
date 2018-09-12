import * as debug from 'debug';
import * as http from 'http';
import * as express from 'express';
import router from './routes/routes';
import * as bodyParser from 'body-parser';
import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';
import * as cors from 'cors';
import * as helmet from 'helmet';
import "reflect-metadata";
import * as morgan from 'morgan';
import {createConnection} from "typeorm";

//get config
const config = require("../config/config.json");
let dataseConfig = config.databaseConfig;

//for typescript
debug('ts-express:server');

export class Application {

    public static async getApp(): Promise<express.Express> {
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

        if(process.env.NODE_ENV === "test")
            dataseConfig = config.databaseTest;
        else
            app.use(morgan('combined'));


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

        const server: http.Server = http.createServer(app);

        // server handlers
        server.on('error', (error) => console.error(error));

        //connection database
        await createConnection(dataseConfig);
         
        console.info("database connection set");

        // server listen
        await server.listen(port);
        console.log(`Server running on port: ${port}`);

        return app;
    }
}

if(process.env.NODE_ENV !== "test")
    Application.getApp();
    