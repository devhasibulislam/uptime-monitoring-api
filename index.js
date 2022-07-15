/**
 * Title: Project initial file
 * Description: Initial file to start the server & worker
 * Author: Hasibul Islam
 * Date: 15/07/2022 [updated]
 */

/* dependencies */
const server = require('./lib/server');
const worker = require('./lib/worker');

/* app object - module scaffolding */
const app = {};

/* initialization to start server & worker */
app.init = () => {
    // start the server
    server.init();

    // start the worker
    worker.init();
}

/* start the project initial file */
app.init();

/* export the app module */
module.exports = app;
