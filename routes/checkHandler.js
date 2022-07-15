/**
 * Title: Create check handler
 * Description: Weather user check a website or not
 * Author: Hasibul Islam
 * Date: 15/07/2022
 */

/* dependency */
const data = require('../lib/data');
const { parseJSON } = require('../utilities/userUtils');
const tokenHandler = require('../routes/tokenHandler');
const { maxCheck } = require('../utilities/environment');
const { createRandomStrings } = require('../utilities/tokenUtils');

/* handle user object - module scaffolding */
const handle = {};

/* creating sample handler function within handle object */
handle.checkHandler = (requestProperties, callBack) => {
    // approaching server methods
    const acceptedMethod = ['get', 'post', 'put', 'delete'];

    // validate getting method
    if (acceptedMethod.indexOf(requestProperties.method) > -1) {
        // catch exact method client side hit to server
        handle._check[requestProperties.method](requestProperties, callBack);
    } else {
        // method not allowed
        callBack(405)
    }
}

/* user secret object - module scaffolding */
handle._check = {};

/* let fetch with methods */
handle._check.post = (requestProperties, callBack) => {
    /** 
     * variable convention
     * -------------------
     * protocol: http:// or https://
     * url: www.google.com
     * method: POST, GET, PUT, DELETE
     * successCode: 200, 400, 401, 403, 500
     * timeOutSeconds: 1s, 5s, 9s
     */

    // validate inputs
    const protocol = typeof requestProperties.userInfo.protocol === 'string'
        && ['http', 'https'].indexOf(requestProperties.userInfo.protocol) > -1
        ? requestProperties.userInfo.protocol
        : null;

    const url = typeof requestProperties.userInfo.url === 'string'
        && requestProperties.userInfo.url.trim().length > 0
        ? requestProperties.userInfo.url
        : null;

    const method = typeof requestProperties.userInfo.method === 'string'
        && ['POST', 'GET', 'PUT', 'DELETE'].indexOf(requestProperties.userInfo.method) > -1
        ? requestProperties.userInfo.method
        : null;

    const successCode = typeof requestProperties.userInfo.successCode === 'object'
        && requestProperties.userInfo.successCode instanceof Array
        ? requestProperties.userInfo.successCode
        : null;

    const timeOutSeconds = typeof requestProperties.userInfo.timeOutSeconds === 'number'
        && requestProperties.userInfo.timeOutSeconds % 1 === 0
        && requestProperties.userInfo.timeOutSeconds >= 1
        && requestProperties.userInfo.timeOutSeconds <= 5
        ? requestProperties.userInfo.timeOutSeconds
        : null;

    // progress to checkout
    if (protocol && url && method && successCode && timeOutSeconds) {
        // verify token
        const token = typeof requestProperties.headersObject.token === 'string'
            ? requestProperties.headersObject.token
            : false;

        // lookup user phone number by reading token
        data.read('tokens', token, (error, tokenData) => {
            if (!error && tokenData) {
                // get the phone number
                const phoneNumber = parseJSON(tokenData).phoneNumber;

                // lookup the user
                data.read('users', phoneNumber, (err, userData) => {
                    if (!err && userData) {
                        tokenHandler._token.verify(token, phoneNumber, isValid => {
                            if (isValid) {
                                // create user instance with checks
                                const user = parseJSON(userData);
                                const checks = typeof user.checks === 'object'
                                    && user.checks instanceof Array
                                    ? user.checks
                                    : [];

                                if (checks.length < maxCheck) {
                                    // creating check object in terms of object
                                    const checkID = createRandomStrings(16);
                                    const check = {
                                        id: checkID,
                                        phoneNumber,
                                        protocol,
                                        url,
                                        method,
                                        successCode,
                                        timeOutSeconds
                                    }

                                    // store to db
                                    data.create('checks', checkID, check, er => {
                                        if (!er) {
                                            user.checks = checks;
                                            user.checks.push(checkID);

                                            // save new user data
                                            data.update('users', phoneNumber, user, e => {
                                                if (!e) {
                                                    callBack(200, check);
                                                } else {
                                                    callBack(404, {
                                                        error: 'not found'
                                                    })
                                                }
                                            })
                                        } else {
                                            callBack(500, {
                                                error: 'internal error'
                                            })
                                        }
                                    })
                                } else {
                                    callBack(429, {
                                        error: 'too many requests'
                                    })
                                }
                            } else {
                                callBack(401, {
                                    error: 'unauthorized token'
                                })
                            }
                        })
                    } else {
                        callBack(401, {
                            error: 'unauthorized access'
                        })
                    }
                })
            } else {
                callBack(403, {
                    error: 'forbidden response'
                })
            }
        })
    } else {
        callBack(400, {
            error: 'invalid request'
        })
    }
};

/* authentication adding done */
handle._check.get = (requestProperties, callBack) => { };

/* authentication adding done */
handle._check.put = (requestProperties, callBack) => { };

/* authentication adding done */
handle._check.delete = (requestProperties, callBack) => { };

/* export module as external module */
module.exports = handle;
