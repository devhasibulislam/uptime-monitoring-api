/**
 * Title: Not found handler route
 * Description: Handler that handle 404 not found from route
 * Author: Hasibul Islam
 * Date: 14/07/2022
 */

/* not found handler object - module scaffolding */
const handle = {};

/* creating sample handler function within handle object */
handle.notFoundHandler = (requestProperties, callBack) => {
    // display to console what in request properties
    console.log(requestProperties);

    // callback function to execute the rest
    callBack(404, {
        message: "404, Your requested URL not found!"
    });
}

/* export module as external module */
module.exports = handle;
