/**
 * Title: User handler route
 * Description: Handler that handle user & method from route
 * Author: Hasibul Islam
 * Date: 14/07/2022
 */

/* dependency */
const data = require('../lib/data');
const { hash } = require('../utilities/hashUtils');
const { parseJSON } = require('../utilities/userUtils');
const tokenHandler = require('../routes/tokenHandler');

/* handle user object - module scaffolding */
const handle = {};

/* creating sample handler function within handle object */
handle.userHandler = (requestProperties, callBack) => {
    // approaching server methods
    const acceptedMethod = ['get', 'post', 'put', 'delete'];

    // validate getting method
    if (acceptedMethod.indexOf(requestProperties.method) > -1) {
        // catch exact method client side hit to server
        handle._user[requestProperties.method](requestProperties, callBack);
    } else {
        // method not allowed
        callBack(405)
    }
}

/* user secret object - module scaffolding */
handle._user = {};

/* let fetch with methods */
handle._user.post = (requestProperties, callBack) => {
    // approaching first name
    const firstName = typeof requestProperties.userInfo.firstName === 'string'
        && requestProperties.userInfo.firstName.trim().length > 0
        ? requestProperties.userInfo.firstName
        : null;

    // approaching last name
    const lastName = typeof requestProperties.userInfo.lastName === 'string'
        && requestProperties.userInfo.lastName.trim().length > 0
        ? requestProperties.userInfo.lastName
        : null;

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

    // approaching teams of service agreement
    const tosAgreement = typeof requestProperties.userInfo.tosAgreement === 'boolean'
        && requestProperties.userInfo.tosAgreement
        ? requestProperties.userInfo.tosAgreement
        : false;

    // validate user info
    if (firstName && lastName && phoneNumber && password && tosAgreement) {
        data.read('users', phoneNumber, (err, userInfo) => {
            // no exist in db can exist in db
            if (err) {
                let userObject = {
                    firstName,
                    lastName,
                    phoneNumber,
                    password: hash(password),
                    tosAgreement
                };

                // store user to db
                data.create('users', phoneNumber, userObject, er => {
                    if (!er) {
                        callBack(200, {
                            message: 'user created successfully'
                        });
                    } else {
                        callBack(500, {
                            message: "could not create user"
                        })
                    }
                })
            } else {
                callBack(500, {
                    message: "there's a problem in server side"
                })
            }
        })
    } else {
        callBack(400, {
            message: "you have a problem in sending request to server"
        })
    }
};

/* authentication adding done */
handle._user.get = (requestProperties, callBack) => {
    // approaching phone number
    const phoneNumber = typeof requestProperties.queryStringObject.phoneNumber === 'string'
        && requestProperties.queryStringObject.phoneNumber.trim().length === 11
        ? requestProperties.queryStringObject.phoneNumber
        : null;

    // lookup the user
    if (phoneNumber) {
        // verify token
        const token = typeof requestProperties.headersObject.token === 'string'
            ? requestProperties.headersObject.token
            : false;

        tokenHandler._token.verify(token, phoneNumber, (tokenID) => {
            if (tokenID) {
                // lookup the user
                data.read('users', phoneNumber, (err, usr) => {
                    // convert user json to object
                    const user = { ...parseJSON(usr) };

                    // display user thrown
                    if (!err && user) {
                        // !# display info without user
                        // delete user.password;
                        callBack(200, user);
                    } else {
                        callBack(404, {
                            message: "interruption in showing user"
                        })
                    }
                })
            } else {
                callBack(403, {
                    message: "authentication failed"
                })
            }
        });
    } else {
        // callback function to execute the rest
        callBack(404, {
            message: "requested user not found"
        });
    }
};

/* authentication adding done */
handle._user.put = (requestProperties, callBack) => {
    // approaching first name
    const firstName = typeof requestProperties.userInfo.firstName === 'string'
        && requestProperties.userInfo.firstName.trim().length > 0
        ? requestProperties.userInfo.firstName
        : null;

    // approaching last name
    const lastName = typeof requestProperties.userInfo.lastName === 'string'
        && requestProperties.userInfo.lastName.trim().length > 0
        ? requestProperties.userInfo.lastName
        : null;

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

    // validate phone number
    if (phoneNumber) {
        // scope to find out update scheme
        if (firstName || lastName || password) {
            // verify token
            const token = typeof requestProperties.headersObject.token === 'string'
                ? requestProperties.headersObject.token
                : false;

            tokenHandler._token.verify(token, phoneNumber, (tokenID) => {
                if (tokenID) {
                    // lookup file from user
                    data.read('users', phoneNumber, (error, userData) => {
                        const user = { ...parseJSON(userData) };
                        if (!error && user) {
                            if (firstName) {
                                user.firstName = firstName;
                            }
                            if (lastName) {
                                user.lastName = lastName;
                            }
                            if (password) {
                                user.password = hash(password);
                            }

                            // store in db
                            data.update('users', phoneNumber, user, err => {
                                if (!err) {
                                    callBack(200, {
                                        message: "user updated successfully"
                                    })
                                } else {
                                    callBack(500, {
                                        message: 'error occurs in server side'
                                    })
                                }
                            })
                        } else {
                            callBack(401, 'user info integration invalid')
                        }
                    })
                } else {
                    callBack(403, {
                        message: "authentication failed"
                    })
                }
            });
        } else {
            callBack(401, {
                message: 'update scheme not valid'
            })
        }
    } else {
        callBack(400, {
            message: 'invalid phone number'
        })
    }
};

/* authentication adding done */
handle._user.delete = (requestProperties, callBack) => {
    // approaching phone number
    const phoneNumber = typeof requestProperties.queryStringObject.phoneNumber === 'string'
        && requestProperties.queryStringObject.phoneNumber.trim().length === 11
        ? requestProperties.queryStringObject.phoneNumber
        : null;

    // validate with phone number to delete
    if (phoneNumber) {
        // verify token
        const token = typeof requestProperties.headersObject.token === 'string'
            ? requestProperties.headersObject.token
            : false;

        tokenHandler._token.verify(token, phoneNumber, (tokenID) => {
            if (tokenID) {
                // lookup the user
                data.read('users', phoneNumber, (error, user) => {
                    if (!error && user) {
                        data.delete('users', phoneNumber, err => {
                            if (!err) {
                                callBack(200, {
                                    message: 'user deletion success'
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
                callBack(403, {
                    message: "authentication failed"
                })
            }
        });
    } else {
        callBack(400, {
            message: 'invalid request'
        })
    }
};

/* export module as external module */
module.exports = handle;
