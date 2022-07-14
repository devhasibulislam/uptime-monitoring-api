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

/* POST method */
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

/* GET method */
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

/* PUT method */
handle._token.put = (requestProperties, callBack) => {
    // approaching token id
    const id = typeof requestProperties.userInfo.id === 'string'
        && requestProperties.userInfo.id.trim().length === 16
        ? requestProperties.userInfo.id
        : null;

    // approaching boolean extend to timing token
    const extend = typeof requestProperties.userInfo.extend === 'boolean'
        && requestProperties.userInfo.extend === true
        ? requestProperties.userInfo.extend
        : false;

    // start validating to be updated
    if (id && extend) {
        data.read('tokens', id, (error, tokenData) => {
            // convert from json to parse object
            const token = { ...parseJSON(tokenData) };
            if (token.expiry > Date.now()) {
                // set new expiry
                token.expiry = Date.now() + (60 * 60 * 100);

                // store to db
                data.update('tokens', id, token, (err) => {
                    if (!err) {
                        callBack(200, {
                            message: 'extend expiry'
                        })
                    } else {
                        callBack(500, {
                            message: 'occurs a server side error'
                        })
                    }
                })
            } else {
                callBack(400, {
                    message: 'token expired'
                })
            }
        })
    } else {
        callBack(400, {
            message: 'token not found'
        })
    }
};

/* DELETE method */
handle._token.delete = (requestProperties, callBack) => {
    // approaching token id
    const id = typeof requestProperties.queryStringObject.id === 'string'
        && requestProperties.queryStringObject.id.trim().length === 16
        ? requestProperties.queryStringObject.id
        : null;

    // validate with token id to delete
    if (id) {
        data.read('tokens', id, (error, user) => {
            if (!error && user) {
                data.delete('tokens', id, err => {
                    if (!err) {
                        callBack(200, {
                            message: 'token deletion success'
                        })
                    } else {
                        callBack(401, {
                            message: 'credential error'
                        })
                    }
                })
            } else {
                callBack(500, {
                    message: 'server side error'
                })
            }
        })
    } else {
        callBack(400, {
            message: 'invalid request'
        })
    }
};

/* verify token */
handle._token.verify = (id, phoneNumber, callBack) => {
    data.read('tokens', id, (error, tokenData) => {
        if (!error && tokenData) {
            // convert json format to parse object
            const token = { ...parseJSON(tokenData) };

            // validate token data
            if ((token.phoneNumber === phoneNumber) && (token.expiry > Date.now())) {
                callBack(true); 
            } else {
                callBack(false);
            }
        } else {
            callBack(false);
        }
    })
}

/* export module as external module */
module.exports = handle;
