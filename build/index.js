"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const debug = require("debug");
const http = require("http");
const server_1 = require("./server");
const serverHandlers = require("./serverHandlers");
debug('ts-express:server');
const port = serverHandlers.normalizePort(process.env.PORT || 3000);
server_1.default.set('port', port);
console.log(`Server listening on port ${port}`);
const server = http.createServer(server_1.default);
// server listen
server.listen(port);
// server handlers
server.on('error', (error) => serverHandlers.onError(error, port));
server.on('listening', serverHandlers.onListening.bind(server));
//# sourceMappingURL=index.js.map