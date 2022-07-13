/**
 * Title: Simple NodeJS project
 * Description: A RESTful API to monitor up and down time of a URL
 * Author: Hasibul Islam
 * Date: 13/07/2022
 */

// dependencies
const http = require('http');

// app object - module scaffolding
const app = {};

// configuration
app.config = {
    port: 3000
};

// create server
app.createServer = () => {
    http.createServer(app.handleReqRes).listen(app.config.port, () => {
        console.log(`Project server listening on port ${app.config.port}`);
    })
}

// handle request response
app.handleReqRes = (req, res) => {
    // response handled
    res.end('Project server connected successfully!')
}

// start the server
app.createServer();
