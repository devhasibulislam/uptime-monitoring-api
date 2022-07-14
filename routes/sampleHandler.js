/**
 * Title: Sample handler route
 * Description: Handler that handle samples from route
 * Author: Hasibul Islam
 * Date: 14/07/2022
 */

/* sample handler object - module scaffolding */
const handle = {};

/* creating sample handler function within handle object */
handle.sampleHandler = (requestProperties, callBack) => {
    // display to console what in request properties
    console.log(requestProperties);

    // callback function to execute the rest
    callBack(200, {
        message: "This is a sample URL to execute"
    });
}

/* export module as external module */
module.exports = handle;
