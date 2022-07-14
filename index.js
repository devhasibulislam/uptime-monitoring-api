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
// !# able to write a file
// data.create('', 'test', {
//     name: "Hasibul Islam",
//     id: 1935202062,
//     dept: "CSE",
// }, err => {
//     console.log(`error is ${err}`);
// })

// !# able to read a file
// data.read('', 'test', (error, data) => {
//     console.log(error, data);
// })

// !# able to update a file
// data.update('', 'test', { institute: 'City University' }, err => {
//     console.log(`error is ${err}`);
// })

// !# able to delete an existing file
// data.delete('', 'test', err => {
//     console.log(err);
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
