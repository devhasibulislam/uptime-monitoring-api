/**
 * Title: Token handler route
 * Description: Handler that handle token to make secure RESTful APIs
 * Author: Hasibul Islam
 * Date: 14/07/2022
 */

/* dependency */
const data = require('../lib/data');
const { hash } = require('../utilities/hashUtils');
const { parseJSON } = require('../utilities/userUtils');
const { createRandomStrings } = require('../utilities/tokenUtils');

/* handle user object - module scaffolding */
const handle = {};

/* creating sample handler function within handle object */
handle.tokenHandler = (requestProperties, callBack) => {
    // approaching server methods
    const acceptedMethod = ['get', 'post', 'put', 'delete'];

    // validate getting method
    if (acceptedMethod.indexOf(requestProperties.method) > -1) {
        // catch exact method client side hit to server
        handle._token[requestProperties.method](requestProperties, callBack);
    } else {
        // method not allowed
        callBack(405)
    }
}

/* user secret object - module scaffolding */
handle._token = {};

/* let fetch with methods */
handle._token.post = (requestProperties, callBack) => {
    // approaching phone number
    const phoneNumber = typeof requestProperties.userInfo.phoneNumber === 'string'
        && requestProperties.userInfo.phoneNumber.trim().length === 11
        ? requestProperties.userInfo.phoneNumber
        : null;

    // approaching password
    const password = typeof requestProperties.userInfo.password === 'string'
        && requestProperties.userInfo.password.trim().length > 0
        ? requestProperties.userInfo.password
        : null;

    // validate with phone number & password
    if (password && phoneNumber) {
        data.read('users', phoneNumber, (error, usr) => {
            // parse data from json format
            const userData = { ...parseJSON(usr) };
            // convert password to hashed password
            const hashedPassword = hash(password);
            if (hashedPassword === userData.password) {
                // token credentials
                const tokenID = createRandomStrings(16);
                const tokenExpires = Date.now() + (60 * 60 * 1000);
                // stored in a object
                const tokenObject = {
                    id: tokenID,
                    phoneNumber,
                    expiry: tokenExpires
                };

                // store the token in db
                data.create('tokens', tokenID, tokenObject, (err) => {
                    if (!err) {
                        callBack(200, tokenObject);
                    } else {
                        callBack(500, {
                            message: 'error occurs in server side'
                        })
                    }
                })
            } else {
                callBack(401, {
                    message: 'invalid credential request'
                })
            }
        })
    } else {
        callBack(400, {
            message: 'invalid request'
        })
    }
};

/* @TODO: authentication required */
handle._token.get = (requestProperties, callBack) => {
    // approaching toke id
    const id = typeof requestProperties.queryStringObject.id === 'string'
        && requestProperties.queryStringObject.id.trim().length === 16
        ? requestProperties.queryStringObject.id
        : null;

    // lookup the token
    if (id) {
        data.read('tokens', id, (err, tokenData) => {
            // convert token json to object
            const token = { ...parseJSON(tokenData) };

            // display token thrown
            if (!err && token) {
                // !# display info without token
                // delete token.password;
                callBack(200, token);
            } else {
                callBack(404, {
                    message: "interruption in showing token"
                })
            }
        })
    } else {
        // callback function to execute the rest
        callBack(404, {
            message: "requested token not found"
        });
    }
};

/* @TODO: authentication required */
handle._token.put = (requestProperties, callBack) => { };

/* @TODO: authentication required */
handle._token.delete = (requestProperties, callBack) => { };

/* export module as external module */
module.exports = handle;
