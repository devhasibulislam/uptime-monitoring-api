/**
 * Title: User handler route
 * Description: Handler that handle user & method from route
 * Author: Hasibul Islam
 * Date: 14/07/2022
 */

/* dependency */
const data = require('../lib/data');
const { hash } = require('../utilities/hashUtils');

/* handle user object - module scaffolding */
const handle = {};

/* creating sample handler function within handle object */
handle.userHandler = (requestProperties, callBack) => {
    // approaching server methods
    const acceptedMethod = ['post', 'get', 'put', 'delete'];

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
        && requestProperties.userInfo.phoneNumber.trim().length > 0
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
        data.read('', phoneNumber, (err, userInfo) => {
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
                data.create('', phoneNumber, userObject, er => {
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

handle._user.get = (requestProperties, callBack) => {
    // callback function to execute the rest
    callBack(200, {
        message: "Welcome to user's route!"
    });
};

handle._user.put = (requestProperties, callBack) => { };

handle._user.delete = (requestProperties, callBack) => { };

/* export module as external module */
module.exports = handle;
