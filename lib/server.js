/**
 * Title: Server library
 * Description: Server credentials containing file
 * Author: Hasibul Islam
 * Date: 15/07/2022
 */

/* dependencies */
const http = require('http');
const { handleReqRes } = require('../utilities/handleReqRes');
const environment = require('../utilities/environment');

/* server object - module scaffolding */
const server = {};

/* create server */
server.createServer = () => {
    http.createServer(server.handleReqRes).listen(environment.port, () => {
        console.log(`server listening on port ${environment.port}`);
    })
}

/* handle request response */
server.handleReqRes = handleReqRes;

/* start the server */
server.init = () => {
    server.createServer();
}

/* export module */
module.exports = server;
