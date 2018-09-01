"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const debug = require("debug");
const http = require("http");
const express = require("express");
const routes_1 = require("./routes/routes");
const bodyParser = require("body-parser");
const compression = require("compression");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const helmet = require("helmet");
require("reflect-metadata");
const morgan = require("morgan");
const typeorm_1 = require("typeorm");
//get config
const config = require("../config/config.json");
//for typescript
debug('ts-express:server');
//variables
const port = 3000;
const app = express();
//global variables
app.set('port', port);
app.set("config", config);
// middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(compression());
app.use(helmet());
app.use(cors());
app.use(morgan('tiny'));
// cors
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS ');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With,' +
        ' Content-Type, Accept,' +
        ' Authorization,' +
        ' Access-Control-Allow-Credentials');
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
});
//Routes
app.use(routes_1.default);
const server = http.createServer(app);
// server listen
server.listen(port);
//connection database
typeorm_1.createConnection(config.databaseConfig).then(connection => {
    // here you can start to work with your entities
    console.info(`Server listening on port ${port}`);
    console.info("database connection set");
}).catch(error => console.info(error));
// server handlers
server.on('error', (error) => console.error(error));
//# sourceMappingURL=server.js.map