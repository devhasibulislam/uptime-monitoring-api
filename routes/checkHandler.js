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
handle._check.get = (requestProperties, callBack) => {
    // validate query id
    const id = typeof requestProperties.queryStringObject.id === 'string'
        && requestProperties.queryStringObject.id.trim().length === 16
        ? requestProperties.queryStringObject.id
        : null;

    if (id) {
        // look up the check
        data.read('checks', id, (error, tokenData) => {
            if (!error && tokenData) {
                // verify token
                const token = typeof requestProperties.headersObject.token === 'string'
                    ? requestProperties.headersObject.token
                    : false;

                tokenHandler._token.verify(token, parseJSON(tokenData).phoneNumber, isValid => {
                    if (isValid) {
                        callBack(200, parseJSON(tokenData));
                    } else {
                        callBack(403, {
                            error: 'forbidden request'
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
        callBack(400, {
            error: 'invalid request'
        })
    }
};

/* authentication adding done */
handle._check.put = (requestProperties, callBack) => {
    // approaching token id
    const id = typeof requestProperties.userInfo.id === 'string'
        && requestProperties.userInfo.id.trim().length === 16
        ? requestProperties.userInfo.id
        : null;

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

    // go through checking out id
    if (id) {
        if (protocol || url || method || successCode || timeOutSeconds) {
            data.read('checks', id, (error, checksData) => {
                if (!error && checksData) {
                    // convert from json to parse
                    const check = parseJSON(checksData);

                    // verify token
                    const token = typeof requestProperties.headersObject.token === 'string'
                        ? requestProperties.headersObject.token
                        : false;

                    tokenHandler._token.verify(token, check.phoneNumber, isValid => {
                        if (isValid) {
                            if (protocol) {
                                check.protocol = protocol;
                            }
                            if (url) {
                                check.url = url;
                            }
                            if (method) {
                                check.method = method;
                            }
                            if (successCode) {
                                check.successCode = successCode;
                            }
                            if (timeOutSeconds) {
                                check.timeOutSeconds = timeOutSeconds;
                            }

                            // update the check object to db
                            data.update('checks', id, check, err => {
                                if (!err) {
                                    callBack(200, {
                                        message: 'success response'
                                    })
                                } else {
                                    callBack(401, {
                                        error: 'unauthorized token'
                                    })
                                }
                            })
                        } else {
                            callBack(403, {
                                error: 'forbidden request'
                            })
                        }
                    })
                } else {
                    callBack(500, {
                        error: 'internal error'
                    })
                }
            })
        }
    } else {
        callBack(400, {
            error: 'invalid request'
        })
    }
};

/* authentication adding done */
handle._check.delete = (requestProperties, callBack) => {
    // validate query id
    const id = typeof requestProperties.queryStringObject.id === 'string'
        && requestProperties.queryStringObject.id.trim().length === 16
        ? requestProperties.queryStringObject.id
        : null;

    if (id) {
        // look up the check
        data.read('checks', id, (error, tokenData) => {
            if (!error && tokenData) {
                // verify token
                const token = typeof requestProperties.headersObject.token === 'string'
                    ? requestProperties.headersObject.token
                    : false;

                tokenHandler._token.verify(token, parseJSON(tokenData).phoneNumber, isValid => {
                    if (isValid) {
                        // delete the check data
                        data.delete('checks', id, err => {
                            if (!err) {
                                data.read('users', parseJSON(tokenData).phoneNumber, (err, userData) => {
                                    if (!err && userData) {
                                        const user = parseJSON(userData);
                                        const checks = typeof user.checks === 'object'
                                            && user.checks instanceof Array
                                            ? user.checks
                                            : [];

                                        // remove check id from user list
                                        const position = checks.indexOf(id);
                                        if (position > -1) {
                                            checks.splice(position, 1);

                                            // re save to user
                                            user.checks = checks;
                                            data.update('users', user.phoneNumber, user, er => {
                                                if(!er){
                                                    callBack(200, {
                                                        message: 'success request'
                                                    })
                                                } else{
                                                    callBack(401, {
                                                        error: 'unauthorized request'
                                                    })
                                                }
                                            })
                                        } else {
                                            callBack(403, {
                                                error: 'forbidden permission'
                                            })
                                        }
                                    } else {
                                        callBack(500, {
                                            error: 'internal error'
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
                            error: 'forbidden request'
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
        callBack(400, {
            error: 'invalid request'
        })
    }
};

/* export module as external module */
module.exports = handle;
