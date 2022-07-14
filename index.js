/**
 * Title: Simple NodeJS project
 * Description: A RESTful API to monitor up and down time of a URL
 * Author: Hasibul Islam
 * Date: 13/07/2022
 */

/* dependencies */
const http = require('http');
const { handleReqRes } = require('./utilities/handleReqRes');
const environment = require('./utilities/environment');
const data = require('./lib/data');

/* app object - module scaffolding */
const app = {};

/* @testing: removed later */
// data.create('', 'newFile', {
//     name: "Hasibul Islam",
//     id: 1935202062,
//     dept: "CSE",
//     institute: 'City University'
// }, err => {
//     process.stdout.write(`error is ${err}`);
// })

/* create server */
app.createServer = () => {
    http.createServer(app.handleReqRes).listen(environment.port, () => {
        console.log(`Project server listening on port ${environment.port}`);
    })
}

/* handle request response */
app.handleReqRes = handleReqRes;

/* start the server */
app.createServer();
