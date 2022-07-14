/**
 * Title: Simple request & response handler
 * Description: A handler that handle request and response form server
 * Author: Hasibul Islam
 * Date: 14/07/2022
 */

// dependency
const url = require('url');
const { StringDecoder } = require('string_decoder');

// handle object - module scaffolding
const handler = {};

// handle request and response
handler.handleReqRes = (req, res) => {
    /* handling request */
    // get the url, path & parse it
    const parsedURL = url.parse(req.url, true);

    // get full path
    const path = parsedURL.path;

    // trim unwanted front and back froward slash of a path
    const trimmedPath = path.replace(/^\/+|\/+$/g, '');

    // which method going to be usedd
    const method = req.method.toLowerCase();

    // get query of a path as object form
    const queryStringObject = parsedURL.query;

    // get headers as an object form
    const headersObject = req.headers;

    // get requested string
    const decoder = new StringDecoder('utf-8');
    let realData = '';

    req.on('data', (buffer) => {
        realData += decoder.write(buffer);
    });

    req.on('end', () => {
        realData += decoder.end();
        console.log(realData);

        // response handled
        res.end('Project server connected successfully!');
    })
}

// export module as external module
module.exports = handler;
