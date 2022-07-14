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
    // approaching phone number
    const phoneNumber = typeof requestProperties.queryStringObject.phoneNumber === 'string'
        && requestProperties.queryStringObject.phoneNumber.trim().length === 11
        ? requestProperties.queryStringObject.phoneNumber
        : null;

    // lookup the user
    if (phoneNumber) {
        data.read('', phoneNumber, (err, usr) => {
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
        // callback function to execute the rest
        callBack(404, {
            message: "requested user not found"
        });
    }

};

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
            // lookup file from user
            data.read('', phoneNumber, (error, userData) => {
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
                    data.update('', phoneNumber, user, err => {
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

handle._user.delete = (requestProperties, callBack) => {
    // approaching phone number
    const phoneNumber = typeof requestProperties.queryStringObject.phoneNumber === 'string'
        && requestProperties.queryStringObject.phoneNumber.trim().length === 11
        ? requestProperties.queryStringObject.phoneNumber
        : null;

    // validate with phone number to delete
    if(phoneNumber){
        data.read('', phoneNumber, (error, user)=>{
            if(!error && user){
                data.delete('', phoneNumber, err =>{
                    if(!err){
                        callBack(200, {
                            message: 'user deletion success'
                        })
                    } else{
                        callBack(401, {
                            message: 'credential error'
                        })
                    }
                })
            } else{
                callBack(500, {
                    message: 'server side error'
                })
            }
        })
    } else{
        callBack(400, {
            message: 'invalid request'
        })
    }
};

/* export module as external module */
module.exports = handle;
